" Menu Translations:	Russian
" Maintainer:		Restorer, <restorer@mail2k.ru>
" Previous Maintainer:	Sergey Alyoshin, <alyoshin.s@gmail.com>
"			vassily ragosin, <vrr[at]users.sourceforge.net>
" Last Change:		23 Aug 2023
" Generated from menu_ru_ru.utf-8.vim, DO NOT EDIT
" URL:			https://github.com/RestorerZ/RuVim
"
"
" Adopted for RuVim project by Vassily Ragosin.
" First translation: Tim Alexeevsky, <realtim [at] mail.ru>,
" based on ukrainian translation by Bohdan Vlasyuk, <bohdan@vstu.edu.ua>
"
"
" Quit when menu translations have already been done.
"
" Check is
"
if exists("did_menu_trans")
   finish
endif
let g:did_menu_trans = 1
let s:keepcpo= &cpo
set cpo&vim

scriptencoding cp1251

" Top
menutrans &File				&����
menutrans &Edit				&������
menutrans &Tools			�&�����
menutrans &Syntax			���&������
menutrans &Buffers			&������
menutrans &Window			&����
menutrans &Help				&�������
"
"
"
" Submenu of menu Help
menutrans &Overview<Tab><F1>		�&����\ �����<Tab>F1
menutrans &User\ Manual			&�����������\ ������������
menutrans &How-to\ links		&����������
menutrans &Find\.\.\.			&�����\.\.\.
"--------------------
menutrans &Credits			��&������
menutrans Co&pying			&��������
menutrans &Sponsor/Register		���&�������\ �\ �����������
menutrans O&rphans			&�������������������
"--------------------
menutrans &Version			&�������\ ������
menutrans &About			&�\ ���������
"
"
" Submenu of File menu
menutrans &Open\.\.\.<Tab>:e		&�������\.\.\.<Tab>:e
menutrans Sp&lit-Open\.\.\.<Tab>:sp	��&�����\ �\ �����\ ����\.\.\.<Tab>:sp
menutrans Open\ &Tab\.\.\.<Tab>:tabnew	�����&��\ �\ �����\ �������\.\.\.<Tab>:tabnew
menutrans &New<Tab>:enew		����&���<Tab>:enew
menutrans &Close<Tab>:close		&�������<Tab>:close
"--------------------
menutrans &Save<Tab>:w			&���������<Tab>:w
menutrans Save\ &As\.\.\.<Tab>:sav	��&�������\ ���\.\.\.<Tab>:sav
"--------------------
menutrans Split\ &Diff\ with\.\.\.	���&�����\ �\.\.\.
menutrans Split\ Patched\ &By\.\.\.	�����&���\ �\ ���������\.\.\.
"--------------------
menutrans &Print			&������\.\.\.
menutrans Sa&ve-Exit<Tab>:wqa		�����&����\ �\ �����<Tab>:wqa
menutrans E&xit<Tab>:qa			�&����<Tab>:qa
"
"
" Submenu of Edit menu
menutrans &Undo<Tab>u			&��������<Tab>u
menutrans &Redo<Tab>^R			�&������<Tab>Ctrl+R
menutrans Rep&eat<Tab>\.		��������&�<Tab>\.
"--------------------
menutrans Cu&t<Tab>"+x			&��������<Tab>"+x
menutrans &Copy<Tab>"+y			&����������<Tab>"+y
menutrans &Paste<Tab>"+gP		���&�����<Tab>"+g\ Shift+P
menutrans Put\ &Before<Tab>[p		���������\ �&����<Tab>[p
menutrans Put\ &After<Tab>]p		���������\ ��&���<Tab>]p
menutrans &Delete<Tab>x			&�������<Tab>x
menutrans &Select\ All<Tab>ggVG		�&�������\ ��<Tab>gg\ Shift+V\ Shift+G
"--------------------
" if has("win32") || has("gui_gtk") || has("gui_kde") || has("gui_motif")
menutrans &Find\.\.\.			&�����\.\.\.
menutrans Find\ and\ Rep&lace\.\.\.	&��������\.\.\.
" else
menutrans &Find<Tab>/			&�����<Tab>/
menutrans Find\ and\ Rep&lace<Tab>:%s	&��������<Tab>:%s
menutrans Find\ and\ Rep&lace<Tab>:s	&��������<Tab>:s
"--------------------
menutrans Settings\ &Window			���\ &���������\.\.\.
menutrans Startup\ &Settings			���������\ �����&��
menutrans &Global\ Settings			�&����\ ���������
menutrans F&ile\ Settings			����&�����\ ��������\ ������
menutrans Show\ C&olor\ Schemes\ in\ Menu	��������\ ����\ ������\ ���&�����\ �����
menutrans C&olor\ Scheme			��������\ �&����
menutrans Show\ &Keymaps\ in\ Menu		��������\ ����\ ������\ ���������\ �&���������
menutrans &Keymap				&���������\ ����������
menutrans None					��\ ������������
menutrans Select\ Fo&nt\.\.\.			&�����\.\.\.
">>>----------------- Edit/Global settings
menutrans Toggle\ Pattern\ &Highlight<Tab>:set\ hls!		���������\ ���&�������<Tab>:set\ hls!
menutrans Toggle\ &Ignoring\ Case<Tab>:set\ ic!			&�������������������\ �����<Tab>:set\ ic!
menutrans Toggle\ &Showing\ Matched\ Pairs<Tab>:set\ sm!	���������\ ������\ &���������<Tab>:set\ sm!
menutrans &Context\ lines					�����������\ ���&��
menutrans &Virtual\ Edit					���&��������\ ��������������
menutrans Toggle\ Insert\ &Mode<Tab>:set\ im!			�����\ &�������<Tab>:set\ im!
menutrans Toggle\ Vi\ C&ompatibility<Tab>:set\ cp!		&�������������\ �\ ����������\ Vi<Tab>:set\ cp!
menutrans Search\ &Path\.\.\.					&��������\ ���\ ������\ ������\.\.\.
menutrans Ta&g\ Files\.\.\.					�&��������\ �����\.\.\.
"
menutrans Toggle\ &Toolbar		�����\ ������\ &������������
menutrans Toggle\ &Bottom\ Scrollbar	�����\ ������\ ���������\ ���&��
menutrans Toggle\ &Left\ Scrollbar	�����\ ������\ ���������\ �&����
menutrans Toggle\ &Right\ Scrollbar	�����\ ������\ ���������\ ���&���
">>>->>>------------- Edit/Global settings/Virtual edit
menutrans Never				���������\ ��\ ����\ �������
menutrans Block\ Selection		��������\ �\ ������\ �����������\ �����
menutrans Insert\ mode			��������\ �\ ������\ �������
menutrans Block\ and\ Insert		��������\ �\ �������\ �����������\ �����\ �\ �������
menutrans Always			��������\ ��\ ����\ �������
">>>----------------- Edit/File settings
menutrans Toggle\ Line\ &Numbering<Tab>:set\ nu!		�����\ &���������\ �����<Tab>:set\ nu!
menutrans Toggle\ relati&ve\ Line\ Numbering<Tab>:set\ rnu!	�����\ ��������&�����\ ���������\ �����<Tab>:set\ nru!
menutrans Toggle\ &List\ Mode<Tab>:set\ list!			�����\ ��&����������\ ������<Tab>:set\ list!
menutrans Toggle\ Line\ &Wrapping<Tab>:set\ wrap!		&��������\ �����\ ��\ �������\ ����<Tab>:set\ wrap!
menutrans Toggle\ W&rapping\ at\ word<Tab>:set\ lbr!		��������\ �����\ ��\ &�������\ ����<Tab>:set\ lbr!
menutrans Toggle\ Tab\ &Expanding<Tab>:set\ et!			������\ ��������\ &���������\ ��\ �������<Tab>:set\ et!
menutrans Toggle\ &Auto\ Indenting<Tab>:set\ ai!		���������\ �������\ ���\ �\ �������\ &������<Tab>:set\ ai!
menutrans Toggle\ &C-Style\ Indenting<Tab>:set\ cin!		���������\ �������\ ���\ �\ &�����\ ��<Tab>:set\ cin!
">>>---
menutrans &Shiftwidth				����&����\ �������
menutrans Soft\ &Tabstop			������\ &���������
menutrans Te&xt\ Width\.\.\.			&������\ ������\.\.\.
menutrans &File\ Format\.\.\.			&������\ �����\.\.\.
"
"
"
" Submenu of Tools menu
menutrans &Jump\ to\ this\ tag<Tab>g^]		&�������\ ��\ ���������<Tab>g\ Ctrl+]
menutrans Jump\ &back<Tab>^T			&���������\ �����<Tab>Ctrl+T
menutrans Build\ &Tags\ File			�������\ ����\ �\ &���������
"-------------------
menutrans &Folding				�&��������\ ������
menutrans &Spelling				��&����������
menutrans &Diff					&���������\ ������
"-------------------
menutrans &Make<Tab>:make			��&��������<Tab>:make
menutrans &List\ Errors<Tab>:cl			������������\ �&�����<Tab>:cl
menutrans L&ist\ Messages<Tab>:cl!		���&�\ ������\ �����������<Tab>:cl!
menutrans &Next\ Error<Tab>:cn			�����&����\ ������\ ��\ ������<Tab>:cn
menutrans &Previous\ Error<Tab>:cp		��&��������\ ������\ ��\ ������<Tab>:cp
menutrans &Older\ List<Tab>:cold		����&������\ ������\ �����������<Tab>:cold
menutrans N&ewer\ List<Tab>:cnew		�&��������\ ������\ �����������<Tab>:cnew
menutrans Error\ &Window			��&��\ ��\ �������\ �����������
menutrans Show\ Compiler\ Se&ttings\ in\ Menu	��������\ ����\ ������\ &�����������
menutrans Se&T\ Compiler			�������\ &����������
"-------------------
menutrans &Convert\ to\ HEX<Tab>:%!xxd		����&���������\ �\ HEX<Tab>:%!xxd
menutrans Conve&rt\ back<Tab>:%!xxd\ -r		�������������\ �&�\ HEX<Tab>:%!xxd\ -r
">>>---------------- Tools/Spelling
menutrans &Spell\ Check\ On			���������\ &��������
menutrans Spell\ Check\ &Off			&��\ ���������\ ��������
menutrans To\ &Next\ error<Tab>]s		�&��������\ ������<Tab>]s
menutrans To\ &Previous\ error<Tab>[s		��&��������\ ������<Tab>[s
menutrans Suggest\ &Corrections<Tab>z=		�������&�\ ���������<Tab>z=
menutrans &Repeat\ correction<Tab>:spellrepall	��������\ &���<Tab>:spellrepall
"-------------------
menutrans Set\ language\ to\ "en"		��������\ ���\ �����\ "en"
menutrans Set\ language\ to\ "en_au"		��������\ ���\ �����\ "en_au"
menutrans Set\ language\ to\ "en_ca"		��������\ ���\ �����\ "en_ca"
menutrans Set\ language\ to\ "en_gb"		��������\ ���\ �����\ "en_gb"
menutrans Set\ language\ to\ "en_nz"		��������\ ���\ �����\ "en_nz"
menutrans Set\ language\ to\ "en_us"		��������\ ���\ �����\ "en_us"
menutrans &Find\ More\ Languages		�����\ ���\ ������\ &������
let g:menutrans_set_lang_to =			'�������� ��� �����'
">>>---------------- Folds
menutrans &Enable/Disable\ folds<Tab>zi		&��������\ ���\ ������\ ���������<Tab>zi
menutrans &View\ Cursor\ Line<Tab>zv		��������\ ������\ ���\ &��������<Tab>zv
menutrans Vie&w\ Cursor\ Line\ only<Tab>zMzx	��������\ &������\ ������\ ���\ ��������<Tab>z\ Shift+M\ zx
menutrans C&lose\ more\ folds<Tab>zm		��������\ ���&������\ �����\ ���������<Tab>zm
menutrans &Close\ all\ folds<Tab>zM		��������\ &���\ �����\ ���������<Tab>z\ Shift+M
menutrans &Open\ all\ folds<Tab>zR		����������\ �&��\ �����\ ���������<Tab>z\ Shift+R
menutrans O&pen\ more\ folds<Tab>zr		��&��������\ ���������\ ����\ ���������<Tab>zr
menutrans Fold\ Met&hod				&�����\ ��������\ ���������
menutrans Create\ &Fold<Tab>zf			��&�����\ ����\ ���������<Tab>zf
menutrans &Delete\ Fold<Tab>zd			&������\ ����\ ���������<Tab>zd
menutrans Delete\ &All\ Folds<Tab>zD		������\ ��&�\ �����\ ���������<Tab>z\ Shift+D
menutrans Fold\ col&umn\ width			&������\ �������\ ��\ ��������\ ���������
">>>->>>----------- Tools/Folds/Fold Method
menutrans M&anual				��������\ ���&����
menutrans I&ndent				��\ ������\ �&�������
menutrans E&xpression				��\ ������\ �&�������
menutrans S&yntax				��\ ������\ &����������
menutrans &Diff					��\ ������\ ��������\ �\ �������
menutrans Ma&rker				��\ ������\ &��������
">>>--------------- Sub of Tools/Diff
menutrans &Update				�&�������\ ����������\ ����
menutrans &Get\ Block				���������\ &�\ �������\ �����
menutrans &Put\ Block				���������\ &��\ ��������\ ������
">>>--------------- Tools/Error window
menutrans &Update<Tab>:cwin			�&�������<Tab>:cwin
menutrans &Close<Tab>:cclose			&�������<Tab>:cclose
menutrans &Open<Tab>:copen			&�������<Tab>:copen
"
"
" Syntax menu
"
menutrans &Show\ File\ Types\ in\ menu		&��������\ ����\ ������\ ����\ �����
menutrans Set\ '&syntax'\ only			�&�����������\ ��������\ 'syntax'
menutrans Set\ '&filetype'\ too			������������\ ����&����\ 'filetype'
menutrans &Off					&���������\ ���������
menutrans &Manual				���������\ ���������\ ���&����
menutrans A&utomatic				���������\ ���������\ &�������������
menutrans on/off\ for\ &This\ file		��������\ �����\ ���\ &��������\ �����
menutrans Co&lor\ test				���������\ ������&��������\ �����
menutrans &Highlight\ test			��������\ ������\ ���&������
menutrans &Convert\ to\ HTML			����&���������\ �������\ ����\ �\ HTML
"
"
" Buffers menu
"
menutrans &Refresh\ menu			&��������\ ������\ �������
menutrans &Delete				&�������\ �����
menutrans &Alternate				&��������\ �����
menutrans &Next					�&��������\ �����
menutrans &Previous				&����������\ �����
"
"
" Submenu of Window menu
"
menutrans &New<Tab>^Wn				&�������<Tab>Ctrl+W\ n
menutrans S&plit<Tab>^Ws			���������\ ��\ &�����������<Tab>Ctrl+W\ s
menutrans Split\ &Vertically<Tab>^Wv		���������\ ��\ &���������<Tab>Ctrl+W\ v
menutrans Sp&lit\ To\ #<Tab>^W^^		�&�������\ ����\ �\ �����\ ����<Tab>Ctrl+W\ Ctrl+^
menutrans Split\ File\ E&xplorer		���������\ ������
"
menutrans &Close<Tab>^Wc			&�������\ �������\ ����<Tab>Ctrl+W\ c
menutrans Close\ &Other(s)<Tab>^Wo		�&������\ ������\ ����<Tab>Ctrl+W\ o
"
menutrans Move\ &To				&�����������
menutrans Rotate\ &Up<Tab>^WR			��������\ ����&�<Tab>Ctrl+W\ Shift+R
menutrans Rotate\ &Down<Tab>^Wr			��������\ �&���<Tab>Ctrl+W\ r
"
menutrans &Equal\ Size<Tab>^W=			������������\ ���&����<Tab>Ctrl+W\ =
menutrans &Max\ Height<Tab>^W_			������������\ �&�����<Tab>Ctrl+W\ _
menutrans M&in\ Height<Tab>^W1_			�����������\ ����&��<Tab>Ctrl+W\ 1_
menutrans Max\ &Width<Tab>^W\|			������������\ &������<Tab>Ctrl+W\ \|
menutrans Min\ Widt&h<Tab>^W1\|			�����������\ �&�����<Tab>Ctrl+W\ 1\|
">>>----------------- Submenu of Window/Move To
menutrans &Top<Tab>^WK				�&����<Tab>Ctrl+W\ Shift+K
menutrans &Bottom<Tab>^WJ			�&���<Tab>Ctrl+W\ Shift+J
menutrans &Left\ side<Tab>^WH			�&����<Tab>Ctrl+W\ Shift+H
menutrans &Right\ side<Tab>^WL			�&�����<Tab>Ctrl+W\ Shift+L
"
"
" The popup menu
"
"
menutrans &Undo					&��������
menutrans Cu&t					&��������
menutrans &Copy					&����������
menutrans &Paste				���&�����
menutrans &Delete				&�������
menutrans Select\ Blockwise			��������\ ���������
menutrans Select\ &Word				��������\ �&����
menutrans Select\ &Line				��������\ �&�����
menutrans Select\ &Block			��������\ &����
menutrans Select\ &All				�&�������\ ��
menutrans Select\ &Sentence			��������\ ������&�����
menutrans Select\ Pa&ragraph			��������\ ��&���
"
" The Spelling popup menu
"
let g:menutrans_spell_change_ARG_to =		'���������\ "%s"'
let g:menutrans_spell_add_ARG_to_word_list =	'��������\ "%s"\ �\ �������'
let g:menutrans_spell_ignore_ARG =		'����������\ "%s"'
"
" The GUI toolbar
"
if has("toolbar")
  if exists("*Do_toolbar_tmenu")
    delfun Do_toolbar_tmenu
  endif
  def g:Do_toolbar_tmenu()
    tmenu ToolBar.New				������� ��������
    tmenu ToolBar.Open				������� ����
    tmenu ToolBar.Save				��������� ����
    tmenu ToolBar.SaveAll			��������� ��� �����
    tmenu ToolBar.Print				������
    tmenu ToolBar.Undo				��������
    tmenu ToolBar.Redo				�������
    tmenu ToolBar.Cut				��������
    tmenu ToolBar.Copy				����������
    tmenu ToolBar.Paste				��������
    tmenu ToolBar.Find				�����...
    tmenu ToolBar.FindNext			����� ���������
    tmenu ToolBar.FindPrev			����� ����������
    tmenu ToolBar.Replace			��������...
    tmenu ToolBar.NewSesn			������� ����� ��������������
    tmenu ToolBar.LoadSesn			��������� ����� ��������������
    tmenu ToolBar.SaveSesn			��������� ����� ��������������
    tmenu ToolBar.RunScript			��������� ��������� ���� ��������� Vim
    tmenu ToolBar.Shell				��������� ��������
    tmenu ToolBar.Make				����������
    tmenu ToolBar.RunCtags			������� ���� � ���������
    tmenu ToolBar.TagJump			������� �� ���������
    tmenu ToolBar.Help				�������
    tmenu ToolBar.FindHelp			����� � ������������
    tmenu ToolBar.WinClose			������� ������� ����
    tmenu ToolBar.WinMax			������������ ������ �������� ����
    tmenu ToolBar.WinMin			����������� ������ �������� ����
    tmenu ToolBar.WinSplit			��������� ���� �� �����������
    tmenu ToolBar.WinVSplit			��������� ���� �� ���������
    tmenu ToolBar.WinMaxWidth			������������ ������ �������� ����
    tmenu ToolBar.WinMinWidth			����������� ������ �������� ����
  enddef
endif
"
"
" Dialog texts
"
" Find in help dialog
"
let g:menutrans_help_dialog = "�������� ������� ��� �����, ������� ��������� ����� � ������������.\n\n����� ����� ������� ������ �������, ����������� ��������� i_ (��������, i_CTRL-X)\n����� ����� ������� ��������� ������, ����������� ��������� c_ (��������, c_<Del>)\n����� ����� ���������� � ����������, ����������� ������ ' (��������, 'shftwidth')"
"
" Search path dialog
"
let g:menutrans_path_dialog = "������� ����� ������� ������������ ���������, ��� ����� ����������� ����� ������"
"
" Tag files dialog
"
let g:menutrans_tags_dialog = "������� ����� ������� ������������ ������ ��������"
"
" Text width dialog
"
let g:menutrans_textwidth_dialog = "������� ���������� �������� ��� ��������� ������ ������\n����� �������� ��������������, ������� 0"
"
" File format dialog
"
let g:menutrans_fileformat_dialog = "�������� ������ �����"
let g:menutrans_fileformat_choices = "&1. Unix\n&2. Dos\n&3. Mac\n������ (&C)"
"
let menutrans_no_file = "[����������]"

" Menus to handle Russian encodings
" Thanks to Pavlo Bohmat for the idea
" vassily ragosin <vrr[at]users.sourceforge.net>
"
an 10.355 &File.-SEP-					<Nop>
an 10.360.20 &File.�������\ �\ ���������\.\.\..CP1251	:browse e ++enc=cp1251<CR>
an 10.360.30 &File.�������\ �\ ���������\.\.\..CP866	:browse e ++enc=cp866<CR>
an 10.360.30 &File.�������\ �\ ���������\.\.\..KOI8-R	:browse e ++enc=koi8-r<CR>
an 10.360.40 &File.�������\ �\ ���������\.\.\..UTF-8	:browse e ++enc=utf-8<CR>
an 10.365.20 &File.���������\ �\ ����������\.\.\..CP1251 :browse w ++enc=cp1251<CR>
an 10.365.30 &File.���������\ �\ ����������\.\.\..CP866	:browse w ++enc=cp866<CR>
an 10.365.30 &File.���������\ �\ ����������\.\.\..KOI8-R :browse w ++enc=koi8-r<CR>
an 10.365.40 &File.���������\ �\ ����������\.\.\..UTF-8	:browse w ++enc=utf-8<CR>
"

let &cpo = s:keepcpo
unlet s:keepcpo
