" Menu Translations:    Simplified Chinese
" Maintainer:           Ada (Haowen) Yu <me@yuhaowen.com>
" Previous Maintainer:  Shun Bai <baishunde@gmail.com>, Yuheng Xie <elephant@linux.net.cn>
" Last Change:          2022 July 9
" Generated from menu_zh_cn.utf-8.vim, DO NOT EDIT
"
" Generated with the scripts from:
"
"       https://github.com/adaext/vim-menutrans-helper

" Quit when menu translations have already been done.

if exists("did_menu_trans")
  finish
endif
let did_menu_trans = 1
let s:keepcpo = &cpo
set cpo&vim

scriptencoding cp936

" Help menu
menutrans &Help ����(&H)
" Help menuitems and dialog {{{1
menutrans &Overview<Tab><F1> ����(&O)<Tab><F1>
menutrans &User\ Manual �û��ֲ�(&U)
menutrans &How-to\ Links ���ʹ��(&H)
menutrans &Find\.\.\. ����(&F)\.\.\.
menutrans &Credits ��л(&C)
menutrans Co&pying ��Ȩ(&P)
menutrans &Sponsor/Register ����/ע��(&S)
menutrans O&rphans ���ȹ¶�(&R)
menutrans &Version �汾(&V)
menutrans &About ����(&A)

" fun! s:Helpfind()
if !exists("g:menutrans_help_dialog")
  let g:menutrans_help_dialog = "��������򵥴��Ի�ð���:\n\nǰ׺ i_ ��ʾ����ģʽ�µ�����(��: i_CTRL-X)\nǰ׺ c_ ��ʾ�������µı༭����(��: c_<Del>)\nǰ׺ ' ��ʾѡ����(��: 'shiftwidth')"
endif
" }}}

" File menu
menutrans &File �ļ�(&F)
" File menuitems {{{1
menutrans &Open\.\.\.<Tab>:e ��(&O)\.\.\.<Tab>:e
menutrans Sp&lit-Open\.\.\.<Tab>:sp �ڲ�ִ��ڴ�(&L)\.\.\.<Tab>:sp
menutrans Open\ Tab\.\.\.<Tab>:tabnew �ڱ�ǩҳ��\.\.\.<Tab>:tabnew
menutrans &New<Tab>:enew �½�(&N)<Tab>:enew
menutrans &Close<Tab>:close �ر�(&C)<Tab>:close
menutrans &Save<Tab>:w ����(&S)<Tab>:w
menutrans Save\ &As\.\.\.<Tab>:sav ���Ϊ(&A)\.\.\.<Tab>:sav
menutrans Split\ &Diff\ With\.\.\. ��ִ����ԶԱȲ���(Diff)(&D)\.\.\.
menutrans Split\ Patched\ &By\.\.\. ��ִ����Խ����޲�(Patch)(&B)\.\.\.
menutrans &Print ��ӡ(&P)
menutrans Sa&ve-Exit<Tab>:wqa ���沢�˳�(&V)<Tab>:wqa
menutrans E&xit<Tab>:qa �˳�(&X)<Tab>:qa
" }}}

" Edit menu
menutrans &Edit �༭(&E)
" Edit menuitems {{{1
menutrans &Undo<Tab>u ����(&U)<Tab>u
menutrans &Redo<Tab>^R �ָ�(&R)<Tab>^R
menutrans Rep&eat<Tab>\. �ظ�(&E)<Tab>\.
menutrans Cu&t<Tab>"+x ����(&T)<Tab>"+x
menutrans &Copy<Tab>"+y ����(&C)<Tab>"+y
menutrans &Paste<Tab>"+gP ճ��(&P)<Tab>"+gP
menutrans Put\ &Before<Tab>[p ճ�������ǰ(&B)<Tab>[p
menutrans Put\ &After<Tab>]p ճ��������(&A)<Tab>]p
menutrans &Delete<Tab>x ɾ��(&D)<Tab>x
menutrans &Select\ All<Tab>ggVG ȫѡ(&S)<Tab>ggVG
menutrans &Find\.\.\. ����(&F)\.\.\.
menutrans Find\ and\ Rep&lace\.\.\. ���Һ��滻(&L)\.\.\.
menutrans &Find<Tab>/ ����(&F)<Tab>/
menutrans Find\ and\ Rep&lace<Tab>:%s ���Һ��滻(&L)<Tab>:%s
menutrans Find\ and\ Rep&lace<Tab>:s ���Һ��滻(&L)<Tab>:s
menutrans Settings\ &Window ���ô���(&W)
menutrans Startup\ &Settings ��������(&S)

" Edit/Global Settings
menutrans &Global\ Settings ȫ������(&G)
" Edit.Global Settings menuitems and dialogs {{{2
menutrans Toggle\ Pattern\ &Highlight<Tab>:set\ hls! ��/�ظ�����������(&H)<Tab>:set\ hls!
menutrans Toggle\ &Ignoring\ Case<Tab>:set\ ic! ��/�غ��Դ�Сд(&I)<Tab>:set\ ic!
menutrans Toggle\ &Showing\ Matched\ Pairs<Tab>:set\ sm! ��/����ʾ����ƥ��(&S)<Tab>:set\ sm!
menutrans &Context\ Lines ����������(&C)
menutrans &Virtual\ Edit ����༭(&V)
" Edit.Global Settings.Virtual Edit menuitems {{{3
menutrans Never �Ӳ�
menutrans Block\ Selection ֻ��ѡ�����ο�ʱ
menutrans Insert\ Mode ֻ�ڲ���ģʽʱ
menutrans Block\ and\ Insert ��ѡ�����ο�Ͳ���ģʽʱ
menutrans Always ʼ��
" }}}
menutrans Toggle\ Insert\ &Mode<Tab>:set\ im! ��/�ز���ģʽ(&M)<Tab>:set\ im!
menutrans Toggle\ Vi\ C&ompatibility<Tab>:set\ cp! ��/��\ Vi\ ������(&O)<Tab>:set\ cp!
menutrans Search\ &Path\.\.\. ����·��(&P)\.\.\.
menutrans Ta&g\ Files\.\.\. ����ļ�(Tags)(&G)\.\.\.

" GUI options
menutrans Toggle\ &Toolbar ��/�ع�����(&T)
menutrans Toggle\ &Bottom\ Scrollbar ��/�صײ�������(&B)
menutrans Toggle\ &Left\ Scrollbar ��/����������(&L)
menutrans Toggle\ &Right\ Scrollbar ��/���Ҳ������(&R)

" fun! s:SearchP()
if !exists("g:menutrans_path_dialog")
  let g:menutrans_path_dialog = "��������·����\n�ö��ŷָ�Ŀ¼����"
endif

" fun! s:TagFiles()
if !exists("g:menutrans_tags_dialog")
  let g:menutrans_tags_dialog = "�������ļ�(Tags)���ơ�\n�ö��ŷָ��ļ�����"
endif
" }}}

" Edit/File Settings
menutrans F&ile\ Settings �ļ�����(&I)
" Edit.File Settings menuitems and dialogs {{{2
" Boolean options
menutrans Toggle\ Line\ &Numbering<Tab>:set\ nu! ��/���к�(&N)<Tab>:set\ nu!
menutrans Toggle\ Relati&ve\ Line\ Numbering<Tab>:set\ rnu! ��/������к�(&V)<Tab>:set\ rnu!
menutrans Toggle\ &List\ Mode<Tab>:set\ list! ��/���б�ģʽ(&L)<Tab>:set\ list!
menutrans Toggle\ Line\ &Wrapping<Tab>:set\ wrap! ��/�ػ���(&W)<Tab>:set\ wrap!
menutrans Toggle\ W&rapping\ at\ Word<Tab>:set\ lbr! ��/�ش�β����(&R)<Tab>:set\ lbr!
menutrans Toggle\ Tab\ &Expanding<Tab>:set\ et! ��/���Ʊ����չ(&E)<Tab>:set\ et!
menutrans Toggle\ &Auto\ Indenting<Tab>:set\ ai! ��/���Զ�����(&A)<Tab>:set\ ai!
menutrans Toggle\ &C-Style\ Indenting<Tab>:set\ cin! ��/��\ C\ ����ʽ����(&C)<Tab>:set\ cin!

" other options
menutrans &Shiftwidth �������(&S)
menutrans Soft\ &Tabstop ���Ʊ�λ���(Soft\ Tabstop)(&T)
menutrans Te&xt\ Width\.\.\. �ı����(&X)\.\.\.
menutrans &File\ Format\.\.\. �ļ���ʽ(&F)\.\.\.

" fun! s:TextWidth()
if !exists("g:menutrans_textwidth_dialog")
  let g:menutrans_textwidth_dialog = "�����ı����(ÿ������ַ�����0 ��ʾ����):"
endif

" fun! s:FileFormat()
if !exists("g:menutrans_fileformat_dialog")
  let g:menutrans_fileformat_dialog = "ѡ���ļ��ı����ʽ:"
endif
if !exists("g:menutrans_fileformat_choices")
  let g:menutrans_fileformat_choices = "&Unix\n&Dos\n&Mac\nȡ��(&C)"
endif
" }}}
menutrans Show\ C&olor\ Schemes\ in\ Menu �ڲ˵�����ʾ��ɫ����(&O)
menutrans C&olor\ Scheme ��ɫ����(&O)
menutrans Show\ &Keymaps\ in\ Menu �ڲ˵�����ʾ����ӳ��(&K)
menutrans &Keymap ����ӳ��(&K)
menutrans Select\ Fo&nt\.\.\. ѡ������(&N)\.\.\.
" }}}

" Programming menu
menutrans &Tools ����(&T)
" Tools menuitems {{{1
menutrans &Jump\ to\ This\ Tag<Tab>g^] ��ת��������(Tag)(&J)<Tab>g^]
menutrans Jump\ &Back<Tab>^T ��ת��(&B)<Tab>^T
menutrans Build\ &Tags\ File ���ɱ���ļ�(Tags)(&T)

" Tools.Spelling Menu
menutrans &Spelling ƴд���(&S)
" Tools.Spelling menuitems and dialog {{{2
menutrans &Spell\ Check\ On ��ƴд���(&S)
menutrans Spell\ Check\ &Off �ر�ƴд���(&O)
menutrans To\ &Next\ Error<Tab>]s ��һ������(&N)<Tab>]s
menutrans To\ &Previous\ Error<Tab>[s ��һ������(&P)<Tab>[s
menutrans Suggest\ &Corrections<Tab>z= ��������(&C)<Tab>z=
menutrans &Repeat\ Correction<Tab>:spellrepall ����ȫ��ͬ�����(&R)<Tab>:spellrepall
menutrans Set\ Language\ to\ "en" ��������Ϊ\ "en"
menutrans Set\ Language\ to\ "en_au" ��������Ϊ\ "en_au"
menutrans Set\ Language\ to\ "en_ca" ��������Ϊ\ "en_ca"
menutrans Set\ Language\ to\ "en_gb" ��������Ϊ\ "en_gb"
menutrans Set\ Language\ to\ "en_nz" ��������Ϊ\ "en_nz"
menutrans Set\ Language\ to\ "en_us" ��������Ϊ\ "en_us"
menutrans &Find\ More\ Languages ���Ҹ�������(&F)

" func! s:SpellLang()
if !exists("g:menutrans_set_lang_to")
  let g:menutrans_set_lang_to = "��������Ϊ"
endif
" }}}

" Tools.Fold Menu
menutrans &Folding �۵�(&F)
" Tools.Fold menuitems {{{2
" open close folds
menutrans &Enable/Disable\ Folds<Tab>zi ����/�����۵�(&E)<Tab>zi
menutrans &View\ Cursor\ Line<Tab>zv չ�����������(&V)<Tab>zv
menutrans Vie&w\ Cursor\ Line\ Only<Tab>zMzx ֻչ�����������(&W)<Tab>zMzx
menutrans C&lose\ More\ Folds<Tab>zm �۵�һ��(&L)<Tab>zm
menutrans &Close\ All\ Folds<Tab>zM �۵�ȫ��(&C)<Tab>zM
menutrans O&pen\ More\ Folds<Tab>zr չ��һ��(&P)<Tab>zr
menutrans &Open\ All\ Folds<Tab>zR չ��ȫ��(&O)<Tab>zR
" fold method
menutrans Fold\ Met&hod �۵���ʽ(&H)
" Tools.Fold.Fold Method menuitems {{{3
menutrans M&anual �ֶ�(&A)
menutrans I&ndent ����(&N)
menutrans E&xpression ���ʽ(&X)
menutrans S&yntax �﷨(&Y)
menutrans &Diff ����(Diff)(&D)
menutrans Ma&rker �Ǻ�(Marker)(&R)
" }}}
" create and delete folds
menutrans Create\ &Fold<Tab>zf �����۵�(&F)<Tab>zf
menutrans &Delete\ Fold<Tab>zd ɾ���۵�(&D)<Tab>zd
menutrans Delete\ &All\ Folds<Tab>zD ɾ��ȫ���۵�(&A)<Tab>zD
" moving around in folds
menutrans Fold\ Col&umn\ Width �۵����������(&W)
" }}}

" Tools.Diff Menu
menutrans &Diff ����(Diff)(&D)
" Tools.Diff menuitems {{{2
menutrans &Update ˢ��(&U)
menutrans &Get\ Block ���öԲ��ı���(&G)
menutrans &Put\ Block ���ñ����ı���(&P)
" }}}

menutrans &Make<Tab>:make ����(Make)(&M)<Tab>:make
menutrans &List\ Errors<Tab>:cl �г�����(&L)<Tab>:cl
menutrans L&ist\ Messages<Tab>:cl! �г���Ϣ(&I)<Tab>:cl!
menutrans &Next\ Error<Tab>:cn ��һ������(&N)<Tab>:cn
menutrans &Previous\ Error<Tab>:cp ��һ������(&P)<Tab>:cp
menutrans &Older\ List<Tab>:cold �ϾɵĴ����б�(&O)<Tab>:cold
menutrans N&ewer\ List<Tab>:cnew ���µĴ����б�(&E)<Tab>:cnew
menutrans Error\ &Window ���󴰿�(&W)
" Tools.Error Window menuitems {{{2
menutrans &Update<Tab>:cwin ˢ��(&U)<Tab>:cwin
menutrans &Open<Tab>:copen ��(&O)<Tab>:copen
menutrans &Close<Tab>:cclose �ر�(&C)<Tab>:cclose
" }}}
menutrans Show\ Compiler\ Se&ttings\ in\ Menu �ڲ˵�����ʾ����������(&T)
menutrans Se&t\ Compiler ���ñ�����(&T)
menutrans &Convert\ to\ HEX<Tab>:%!xxd ת����ʮ������(&C)<Tab>:%!xxd
menutrans Conve&rt\ Back<Tab>:%!xxd\ -r ת����(&R)<Tab>:%!xxd\ -r
" }}}

" Buffer menu
menutrans &Buffers ������(&B)
" Buffer menuitems and dialog {{{1
menutrans &Refresh\ Menu ˢ�±��˵�(&R)
menutrans &Delete ɾ��(&D)
menutrans &Alternate �л�(&A)
menutrans &Next ��һ��(&N)
menutrans &Previous ��һ��(&P)

" func! s:BMMunge(fname, bnum)
if !exists("g:menutrans_no_file")
  let g:menutrans_no_file = "[���ļ�]"
endif
" }}}

" Window menu
menutrans &Window ����(&W)
" Window menuitems {{{1
menutrans &New<Tab>^Wn �½�(&N)<Tab>^Wn
menutrans S&plit<Tab>^Ws ���(&P)<Tab>^Ws
menutrans Sp&lit\ To\ #<Tab>^W^^ ��ֲ���ʾ������\ #(&L)<Tab>^W^^
menutrans Split\ &Vertically<Tab>^Wv ��ֱ���(&V)<Tab>^Wv
menutrans Split\ File\ E&xplorer ��ֲ����ļ������(&X)
menutrans &Close<Tab>^Wc �ر�(&C)<Tab>^Wc
menutrans Close\ &Other(s)<Tab>^Wo ����֮��ȫ���ر�(&O)<Tab>^Wo
menutrans Move\ &To �ƶ���(&T)
menutrans &Top<Tab>^WK ����(&T)<Tab>^WK
menutrans &Bottom<Tab>^WJ �׶�(&B)<Tab>^WJ
menutrans &Left\ Side<Tab>^WH ���(&L)<Tab>^WH
menutrans &Right\ Side<Tab>^WL �ұ�(&R)<Tab>^WL
menutrans Rotate\ &Up<Tab>^WR �����ֻ�(&U)<Tab>^WR
menutrans Rotate\ &Down<Tab>^Wr �����ֻ�(&D)<Tab>^Wr
menutrans &Equal\ Size<Tab>^W= ƽ���ֲ�(&E)<Tab>^W=
menutrans &Max\ Height<Tab>^W_ ���߶�(&M)<Tab>^W
menutrans M&in\ Height<Tab>^W1_ ��С�߶�(&I)<Tab>^W1_
menutrans Max\ &Width<Tab>^W\| �����(&W)<Tab>^W\|
menutrans Min\ Widt&h<Tab>^W1\| ��С���(&H)<Tab>^W1\|
" }}}

" The popup menu {{{1
menutrans &Undo ����(&U)
menutrans Cu&t ����(&T)
menutrans &Copy ����(&C)
menutrans &Paste ճ��(&P)
menutrans &Delete ɾ��(&D)
menutrans Select\ Blockwise ��Ϊѡ�����ο�
menutrans Select\ &Word ѡ������(&W)
menutrans Select\ &Sentence ѡ����(&S)
menutrans Select\ Pa&ragraph ѡ������(&R)
menutrans Select\ &Line ѡ����(&L)
menutrans Select\ &Block ѡ�����ο�(&B)
menutrans Select\ &All ȫѡ(&A)

" func! <SID>SpellPopup()
if !exists("g:menutrans_spell_change_ARG_to")
  let g:menutrans_spell_change_ARG_to = '��\ "%s"\ ����Ϊ'
endif
if !exists("g:menutrans_spell_add_ARG_to_word_list")
  let g:menutrans_spell_add_ARG_to_word_list = '��\ "%s"\ ��ӵ��ʵ�'
endif
if !exists("g:menutrans_spell_ignore_ARG")
  let g:menutrans_spell_ignore_ARG = '����\ "%s"'
endif
" }}}

" The GUI toolbar {{{1
if has("toolbar")
  if exists("*Do_toolbar_tmenu")
    delfun Do_toolbar_tmenu
  endif
  fun Do_toolbar_tmenu()
    let did_toolbar_tmenu = 1
    tmenu ToolBar.Open ���ļ�
    tmenu ToolBar.Save ���浱ǰ�ļ�
    tmenu ToolBar.SaveAll ȫ������
    tmenu ToolBar.Print ��ӡ
    tmenu ToolBar.Undo ����
    tmenu ToolBar.Redo �ָ�
    tmenu ToolBar.Cut ���е�������
    tmenu ToolBar.Copy ���Ƶ�������
    tmenu ToolBar.Paste �Ӽ�����ճ��
    if !has("gui_athena")
      tmenu ToolBar.Replace ���Һ��滻...
      tmenu ToolBar.FindNext ������һ��
      tmenu ToolBar.FindPrev ������һ��
    endif
    tmenu ToolBar.LoadSesn ���ػỰ
    tmenu ToolBar.SaveSesn ���浱ǰ�Ự
    tmenu ToolBar.RunScript ���� Vim �ű�
    tmenu ToolBar.Make ���ɵ�ǰ��Ŀ (:make)
    tmenu ToolBar.RunCtags �ڵ�ǰĿ¼���ɱ��(Tags) (!ctags -R .)
    tmenu ToolBar.TagJump ��ת��������ڱ��(Tag)
    tmenu ToolBar.Help Vim ����
    tmenu ToolBar.FindHelp �� Vim �����в���
  endfun
endif
" }}}

" Syntax menu
menutrans &Syntax �﷨(&S)
" Syntax menuitems {{{1
menutrans &Show\ File\ Types\ in\ Menu �ڲ˵�����ʾ�ļ�����(&S)
menutrans &Off �ر�(&O)
menutrans &Manual �ֶ�(&M)
menutrans A&utomatic �Զ�(&U)
menutrans On/Off\ for\ &This\ File ֻ������ļ���/��(&T)
menutrans Co&lor\ Test ɫ�ʲ���(&L)
menutrans &Highlight\ Test ��������(&H)
menutrans &Convert\ to\ HTML ת����\ HTML(&C)

" From synmenu.vim
menutrans Set\ '&syntax'\ Only ֻ����\ 'syntax'(&S)
menutrans Set\ '&filetype'\ Too Ҳ����\ 'filetype'(&F)
menutrans Oracle\ config Oracle\ �����ļ�
menutrans Vim\ help\ file Vim\ �����ļ�
menutrans Vim\ script Vim\ �ű�
menutrans Viminfo\ file Vim\ ��Ϣ�ļ�
menutrans Virata\ config Virata\ �����ļ�
menutrans Whitespace\ (add) ���Ӽ����ո�
" }}}

" Netrw menu {{{1
" Plugin loading may be after menu translation
" So giveup testing if Netrw Plugin is loaded
" if exists("g:loaded_netrwPlugin")
  menutrans Help<tab><F1> ����<tab><F1>
  menutrans Bookmarks ��ǩ
  menutrans History ��ʷ��¼
  menutrans Go\ Up\ Directory<tab>- ����һ��<tab>-
  menutrans Apply\ Special\ Viewer<tab>x ��Ĭ�ϳ����<tab>x
  menutrans Bookmarks\ and\ History ��ǩ����ʷ��¼
  " Netrw.Bookmarks and History menuitems {{{2
  menutrans Bookmark\ Current\ Directory<tab>mb �����ǩ<tab>mb
  menutrans Bookmark\ Delete �Ƴ���ǩ
  menutrans Goto\ Prev\ Dir\ (History)<tab>u ����(��ʷ��¼)<tab>u
  menutrans Goto\ Next\ Dir\ (History)<tab>U ǰ��(��ʷ��¼)<tab>U
  menutrans List<tab>qb �����б�<tab>qb
  " }}}
  menutrans Browsing\ Control ����
  " Netrw.Browsing Control menuitems {{{2
  menutrans Horizontal\ Split<tab>o �ڲ�ִ��ڴ�<tab>o
  menutrans Vertical\ Split<tab>v �ڴ�ֱ��ִ��ڴ�<tab>v
  menutrans New\ Tab<tab>t �ڱ�ǩҳ��<tab>t
  menutrans Preview<tab>p Ԥ��<tab>p
  menutrans Edit\ File\ Hiding\ List<tab><ctrl-h> �༭��������(Hiding\ List)<tab><ctrl-h>
  menutrans Edit\ Sorting\ Sequence<tab>S �༭��������(Sorting\ Sequence)<tab>S
  menutrans Quick\ Hide/Unhide\ Dot\ Files<tab>gh ��������/��ʾ��\.��ͷ���ļ�<tab>gh
  menutrans Refresh\ Listing<tab><ctrl-l> ˢ��<tab><ctrl-l>
  menutrans Settings/Options<tab>:NetrwSettings ����/ѡ��<tab>:NetrwSettings
  " }}}
  menutrans Delete\ File/Directory<tab>D ɾ���ļ�/Ŀ¼<tab>D
  menutrans Edit\ File/Dir �༭�ļ�/Ŀ¼
  " Netrw.Edit File menuitems {{{2
  menutrans Create\ New\ File<tab>% �½��ļ�<tab>%
  menutrans In\ Current\ Window<tab><cr> �ڵ�ǰ����<tab><cr>
  menutrans Preview\ File/Directory<tab>p Ԥ���ļ�/Ŀ¼<tab>p
  menutrans In\ Previous\ Window<tab>P ����һ������<tab>P
  menutrans In\ New\ Window<tab>o ���´���<tab>o
  menutrans In\ New\ Tab<tab>t ���±�ǩҳ<tab>t
  menutrans In\ New\ Vertical\ Window<tab>v ���´�ֱ����<tab>v
  " }}}
  menutrans Explore ���
  " Netrw.Explore menuitems {{{2
  menutrans Directory\ Name ָ��Ŀ¼��
  menutrans Filenames\ Matching\ Pattern\ (curdir\ only)<tab>:Explore\ */ ƥ��ָ���ļ���ģʽ(��ǰĿ¼)<tab>:Explore\ */
  menutrans Filenames\ Matching\ Pattern\ (+subdirs)<tab>:Explore\ **/ ƥ��ָ���ļ���ģʽ(����Ŀ¼)<tab>:Explore\ **/
  menutrans Files\ Containing\ String\ Pattern\ (curdir\ only)<tab>:Explore\ *// ���ݰ���ָ���ַ���ģʽ(��ǰĿ¼)<tab>:Explore\ *//
  menutrans Files\ Containing\ String\ Pattern\ (+subdirs)<tab>:Explore\ **// ���ݰ���ָ���ַ���ģʽ(����Ŀ¼)<tab>:Explore\ **//
  menutrans Next\ Match<tab>:Nexplore ��һ��ƥ����<tab>:Nexplore
  menutrans Prev\ Match<tab>:Pexplore ��һ��ƥ����<tab>:Pexplore
  " }}}
  menutrans Make\ Subdirectory<tab>d �½���Ŀ¼<tab>d
  menutrans Marked\ Files ѡ����(Marked)�ļ�
  " Netrw.Marked Files menuitems {{{2
  menutrans Mark\ File<tab>mf ѡ��(Mark)/ȡ��<tab>mf
  menutrans Mark\ Files\ by\ Regexp<tab>mr ��������ʽ(Regexp)ѡ��<tab>mr
  menutrans Hide-Show-List\ Control<tab>a ����/��ʾ<tab>a
  menutrans Copy\ To\ Target<tab>mc ���Ƶ�Ŀ��<tab>mc
  menutrans Delete<tab>D ɾ��<tab>D
  menutrans Diff<tab>md ����(Diff)<tab>md
  menutrans Edit<tab>me �༭<tab>me
  menutrans Exe\ Cmd<tab>mx ��Ϊ������������<tab>mx
  menutrans Move\ To\ Target<tab>mm �ƶ���Ŀ��<tab>mm
  menutrans Obtain<tab>O ��ȡ<tab>O
  menutrans Print<tab>mp ��ӡ<tab>mp
  menutrans Replace<tab>R �滻<tab>R
  menutrans Set\ Target<tab>mt ����Ŀ��<tab>mt
  menutrans Tag<tab>mT ���ɱ���ļ�(Tags)<tab>mT
  menutrans Zip/Unzip/Compress/Uncompress<tab>mz ѹ��/��ѹ��<tab>mz
  " }}}
  menutrans Obtain\ File<tab>O ��ȡ�ļ�<tab>O
  menutrans Style ��ʾ���
  " Netrw.Style menuitems {{{2
  menutrans Listing �б���ʽ
  " Netrw.Style.Listing menuitems {{{3
  menutrans thin<tab>i ����<thin)<tab>i
  menutrans long<tab>i ��ϸ(long)<tab>i
  menutrans wide<tab>i ����(wide)<tab>i
  menutrans tree<tab>i ��״(tree)<tab>i
  " }}}
  menutrans Normal-Hide-Show ��ʾ/����
  " Netrw.Style.Normal-Hide_show menuitems {{{3
  menutrans Show\ All<tab>a ��ʾȫ��
  menutrans Normal<tab>a ����ʾ�����ļ�
  menutrans Hidden\ Only<tab>a ֻ��ʾ�����ļ�
  " }}}
  menutrans Reverse\ Sorting\ Order<tab>r ����/����<tab>r
  menutrans Sorting\ Method ����ʽ
  " Netrw.Style.Sorting Method menuitems {{{3
  menutrans Name<tab>s �ļ���<tab>s
  menutrans Time<tab>s �޸�ʱ��<tab>s
  menutrans Size<tab>s ��С<tab>s
  menutrans Exten<tab>s ��չ��<tab>s
  " }}}
  " }}}
  menutrans Rename\ File/Directory<tab>R �������ļ�/Ŀ¼<tab>R
  menutrans Set\ Current\ Directory<tab>c ����\ Vim\ ����Ŀ¼<tab>c
  menutrans Targets Ŀ��
" endif
" }}}

" Shellmenu menu
" Shellmenu menuitems {{{1
" From shellmenu.vim
menutrans ShellMenu Shell\ �˵�
menutrans Statements ���
menutrans Test ����
menutrans Existence ����
menutrans Existence\ -\ file ����\ -\ �ļ�
menutrans Existence\ -\ file\ (not\ empty) ����\ -\ �ļ�(�ǿ�)
menutrans Existence\ -\ directory ����\ -\ Ŀ¼
menutrans Existence\ -\ executable ����\ -\ ��ִ��
menutrans Existence\ -\ readable ����\ -\ �ɶ�
menutrans Existence\ -\ writable ����\ -\ ��д
menutrans String\ is\ empty �ַ���Ϊ��
menutrans String\ is\ not\ empty �ַ����ǿ�
menutrans Strings\ are\ equal �ַ���ֵ���
menutrans Strings\ are\ not\ equal �ַ���ֵ�����
menutrans Value\ is\ greater\ than ֵ����
menutrans Value\ is\ greater\ equal ֵ���ڵ���
menutrans Values\ are\ equal ֵ���
menutrans Values\ are\ not\ equal ֵ�����
menutrans Value\ is\ less\ than ֵС��
menutrans Value\ is\ less\ equal ֵС�ڵ���
menutrans ParmSub �����滻
menutrans Substitute\ word\ if\ parm\ not\ set �������û���þ��滻�ô�
menutrans Set\ parm\ to\ word\ if\ not\ set ����δ���þ���Ϊ�ô�
menutrans Substitute\ word\ if\ parm\ set\ else\ nothing ����������þ��滻�ôʣ�����ʲô������
menutrans If\ parm\ not\ set\ print\ word\ and\ exit �������û�����þʹ�ӡ�ôʲ��˳�
menutrans SpShVars Shell\ �������
menutrans Number\ of\ positional\ parameters λ�ò�������Ŀ
menutrans All\ positional\ parameters\ (quoted\ spaces) ����λ�ò���(quoted\ spaces)
menutrans All\ positional\ parameters\ (unquoted\ spaces) ����λ�ò���(unquoted\ spaces)
menutrans Flags\ set ���ñ�־
menutrans Return\ code\ of\ last\ command ����ǰһ������Ĵ���
menutrans Process\ number\ of\ this\ shell shell\ ������̺�
menutrans Process\ number\ of\ last\ background\ command ǰһ����̨����Ľ��̺�
menutrans Environ ��������
menutrans Mark\ created\ or\ modified\ variables\ for\ export ����޸ĵĻ��ߴ����ı���Ϊ����
menutrans Exit\ when\ command\ returns\ non-zero\ status ������ط���״̬ʱ�˳�
menutrans Disable\ file\ name\ expansion �����ļ�����չ
menutrans Locate\ and\ remember\ commands\ when\ being\ looked\ up ����ѯ����ʱ��λ����ס������
menutrans All\ assignment\ statements\ are\ placed\ in\ the\ environment\ for\ a\ command ���еĸ�ֵ��������������Ļ�����
menutrans Read\ commands\ but\ do\ not\ execute\ them ������ǲ�Ҫִ��
menutrans Exit\ after\ reading\ and\ executing\ one\ command ����ִ��һ������֮���˳�
menutrans Treat\ unset\ variables\ as\ an\ error\ when\ substituting �滻ʱ��δ����������Ϊ����
menutrans Print\ shell\ input\ lines\ as\ they\ are\ read ��\ shell\ �����е�ʱ���ӡ
menutrans Print\ commands\ and\ their\ arguments\ as\ they\ are\ executed ��ִ��ʱ��ӡ����Ͳ���
" }}}

" termdebug menu
" termdebug menuitems {{{1
" From termdebug.vim
menutrans Set\ breakpoint ���öϵ�
menutrans Clear\ breakpoint ����ϵ�
menutrans Run\ until ���е�
menutrans Evaluate ��ֵ
menutrans WinBar ������
menutrans Step ����
menutrans Next ��һ��
menutrans Finish ����
menutrans Cont ����
menutrans Stop ֹͣ
" }}}

" debchangelog menu
" debchangelog menuitems {{{1
" From debchangelog.vim
menutrans &Changelog ������־(&C)
menutrans &New\ Version �°汾(&N)
menutrans &Add\ Entry �����Ŀ(&A)
menutrans &Close\ Bug �ر�\ Bug(&C)
menutrans Set\ &Distribution ���÷��а�(&D)
menutrans &unstable ���ȶ�(&U)
menutrans Set\ &Urgency ���ý���(&U)
menutrans &low ��(&L)
menutrans &medium ��(&M)
menutrans &high ��(&H)
menutrans U&nfinalise δ���(&N)
menutrans &Finalise ���(&F)
" }}}

" ada menu
" ada menuitems {{{1
" From ada.vim
menutrans Tag ��ǩ
menutrans List �б�
menutrans Jump ��ת
menutrans Create\ File �����ļ�
menutrans Create\ Dir ����Ŀ¼
menutrans Highlight ����
menutrans Toggle\ Space\ Errors �л��ո����
menutrans Toggle\ Lines\ Errors �л��д���
menutrans Toggle\ Rainbow\ Color �л��ʺ���ɫ
menutrans Toggle\ Standard\ Types �л���׼����
" }}}

" gnat menu
" gnat menuitems {{{1
" From gnat.vim
menutrans Build ����
menutrans Pretty\ Print ���¸�ʽ������
menutrans Find ����
menutrans Set\ Projectfile\.\.\. ������Ŀ�ļ�\.\.\.
" }}}

let &cpo = s:keepcpo
unlet s:keepcpo

" vim: set ts=4 sw=4 noet fdm=marker fdc=4 :
