" Vim filetype plugin autoload file
" Language:	man
" Maintainer:	Jason Franklin <vim@justemail.net>
" Maintainer:	SungHyun Nam <goweol@gmail.com>
" Autoload Split: Bram Moolenaar
" Last Change: 	2022 Jun 18

let s:cpo_save = &cpo
set cpo-=C

let s:man_tag_depth = 0

let s:man_sect_arg = ""
let s:man_find_arg = "-w"
try
  if !has("win32") && $OSTYPE !~ 'cygwin\|linux' && system('uname -s') =~ "SunOS" && system('uname -r') =~ "^5"
    let s:man_sect_arg = "-s"
    let s:man_find_arg = "-l"
  endif
catch /E145:/
  " Ignore the error in restricted mode
endtry

func dist#man#PreGetPage(cnt)
  if a:cnt == 0
    let old_isk = &iskeyword
    if &ft == 'man'
      setl iskeyword+=(,)
    endif
    let str = expand("<cword>")
    let &l:iskeyword = old_isk
    let page = substitute(str, '(*\(\k\+\).*', '\1', '')
    let sect = substitute(str, '\(\k\+\)(\([^()]*\)).*', '\2', '')
    if match(sect, '^[0-9 ]\+$') == -1
      let sect = ""
    endif
    if sect == page
      let sect = ""
    endif
  else
    let sect = a:cnt
    let page = expand("<cword>")
  endif
  call dist#man#GetPage('', sect, page)
endfunc

func s:GetCmdArg(sect, page)

  if empty(a:sect)
    return shellescape(a:page)
  endif

  return s:man_sect_arg . ' ' . shellescape(a:sect) . ' ' . shellescape(a:page)
endfunc

func s:FindPage(sect, page)
  let l:cmd = printf('man %s %s', s:man_find_arg, s:GetCmdArg(a:sect, a:page))
  call system(l:cmd)

  if v:shell_error
    return 0
  endif

  return 1
endfunc

func dist#man#GetPage(cmdmods, ...)
  if a:0 >= 2
    let sect = a:1
    let page = a:2
  elseif a:0 >= 1
    let sect = ""
    let page = a:1
  else
    return
  endif

  " To support:	    nmap K :Man <cword>
  if page == '<cword>'
    let page = expand('<cword>')
  endif

  if !exists('g:ft_man_no_sect_fallback') || (g:ft_man_no_sect_fallback == 0)
    if sect != "" && s:FindPage(sect, page) == 0
      let sect = ""
    endif
  endif
  if s:FindPage(sect, page) == 0
    let msg = 'man.vim: no manual entry for "' . page . '"'
    if !empty(sect)
      let msg .= ' in section ' . sect
    endif
    echomsg msg
    return
  endif
  exec "let s:man_tag_buf_".s:man_tag_depth." = ".bufnr("%")
  exec "let s:man_tag_lin_".s:man_tag_depth." = ".line(".")
  exec "let s:man_tag_col_".s:man_tag_depth." = ".col(".")
  let s:man_tag_depth = s:man_tag_depth + 1

  let open_cmd = 'edit'

  " Use an existing "man" window if it exists, otherwise open a new one.
  if &filetype != "man"
    let thiswin = winnr()
    exe "norm! \<C-W>b"
    if winnr() > 1
      exe "norm! " . thiswin . "\<C-W>w"
      while 1
	if &filetype == "man"
	  break
	endif
	exe "norm! \<C-W>w"
	if thiswin == winnr()
	  break
	endif
      endwhile
    endif
    if &filetype != "man"
      if exists("g:ft_man_open_mode")
        if g:ft_man_open_mode == 'vert'
	  let open_cmd = 'vsplit'
        elseif g:ft_man_open_mode == 'tab'
	  let open_cmd = 'tabedit'
        else
	  let open_cmd = 'split'
        endif
      else
	let open_cmd = a:cmdmods . ' split'
      endif
    endif
  endif

  silent execute open_cmd . " $HOME/" . page . '.' . sect . '~'

  " Avoid warning for editing the dummy file twice
  setl buftype=nofile noswapfile

  setl fdc=0 ma nofen nonu nornu
  %delete _
  let unsetwidth = 0
  if empty($MANWIDTH)
    let $MANWIDTH = winwidth(0)
    let unsetwidth = 1
  endif

  " Ensure Vim is not recursively invoked (man-db does this) when doing ctrl-[
  " on a man page reference by unsetting MANPAGER.
  " Some versions of env(1) do not support the '-u' option, and in such case
  " we set MANPAGER=cat.
  if !exists('s:env_has_u')
    call system('env -u x true')
    let s:env_has_u = (v:shell_error == 0)
  endif
  let env_cmd = s:env_has_u ? 'env -u MANPAGER' : 'env MANPAGER=cat'
  let env_cmd .= ' GROFF_NO_SGR=1'
  let man_cmd = env_cmd . ' man ' . s:GetCmdArg(sect, page) . ' | col -b'
  silent exec "r !" . man_cmd

  if unsetwidth
    let $MANWIDTH = ''
  endif
  " Remove blank lines from top and bottom.
  while line('$') > 1 && getline(1) =~ '^\s*$'
    1delete _
  endwhile
  while line('$') > 1 && getline('$') =~ '^\s*$'
    $delete _
  endwhile
  1
  setl ft=man nomod
  setl bufhidden=hide
  setl nobuflisted
  setl noma
endfunc

func dist#man#PopPage()
  if s:man_tag_depth > 0
    let s:man_tag_depth = s:man_tag_depth - 1
    exec "let s:man_tag_buf=s:man_tag_buf_".s:man_tag_depth
    exec "let s:man_tag_lin=s:man_tag_lin_".s:man_tag_depth
    exec "let s:man_tag_col=s:man_tag_col_".s:man_tag_depth
    exec s:man_tag_buf."b"
    exec s:man_tag_lin
    exec "norm! ".s:man_tag_col."|"
    exec "unlet s:man_tag_buf_".s:man_tag_depth
    exec "unlet s:man_tag_lin_".s:man_tag_depth
    exec "unlet s:man_tag_col_".s:man_tag_depth
    unlet s:man_tag_buf s:man_tag_lin s:man_tag_col
  endif
endfunc

let &cpo = s:cpo_save
unlet s:cpo_save

" vim: set sw=2 ts=8 noet:
