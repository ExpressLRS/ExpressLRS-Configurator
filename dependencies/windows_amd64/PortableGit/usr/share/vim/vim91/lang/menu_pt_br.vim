" Menu Translations: Portugu�s do Brasil
" Maintainer: Jos� de Paula <jose@infoviaweb.com>
" Contributor:		JNylson <nylsinho_ba@hotmail.com>
" Last Change:		2024 Ago 29
" Original translations

" Quit when menu translations have already been done.
if exists("did_menu_trans")
	finish
endif
let did_menu_trans = 1
let s:keepcpo= &cpo
set cpo&vim

" Translations in latin1 (ISO-8859-1), and should work in
" latin9 (ISO-8859-15)

if &enc != "cp1252" && &enc != "iso-8859-15"
	scriptencoding latin1
endif

" Help menu
menutrans &Help			Aj&uda
menutrans &Overview<Tab><F1>	&Conte�do
menutrans &User\ Manual		&Manual\ do\ Usu�rio
menutrans &How-To\ Links	Como\ &fazer?
menutrans &Find\.\.\.		&Procurar\.\.\.
menutrans &Credits		C&r�ditos
menutrans O&rphans		�rf�&os
menutrans Co&pying		&Licen�a
menutrans &Sponsor/Register	&Doar/Registrar
menutrans &Version		&Vers�o
menutrans &About		&Sobre

" File menu
menutrans &File				&Arquivo
menutrans &Open\.\.\.<Tab>:e		&Abrir\.\.\.<Tab>:e
menutrans Sp&lit-Open\.\.\.<Tab>:sp	Abrir\ em\ outra\ &janela\.\.\.<Tab>:sp
menutrans Open\ &Tab\.\.\.<Tab>:tabnew	A&brir\ em\ outra\ aba\.\.\.<Tab>:tabnew
menutrans &New<Tab>:enew		&Novo<Tab>:enew
menutrans &Close<Tab>:close		&Fechar<Tab>:close
menutrans &Save<Tab>:w			&Salvar<Tab>:w
menutrans Save\ &As\.\.\.<Tab>:sav	Salvar\ &como\.\.\.<Tab>:sav
menutrans Split\ &Diff\ with\.\.\.	&Exibir\ diferen�as\ com\.\.\.
menutrans Split\ Patched\ &By\.\.\.	E&xibir\ patcheado\ por\.\.\.
menutrans &Print			I&mprimir
menutrans Sa&ve-Exit<Tab>:wqa		Sal&var\ e\ sair<Tab>:wqa
menutrans E&xit<Tab>:qa			Sa&ir<Tab>:qa

" Edit menu
menutrans &Edit				&Editar
menutrans &Undo<Tab>u			&Desfazer<Tab>u
menutrans &Redo<Tab>^R			&Refazer<Tab>^R
menutrans Rep&eat<Tab>\.		Repe&tir<Tab>\.
menutrans Cu&t<Tab>"+x			Re&cortar<Tab>"+x
menutrans &Copy<Tab>"+y			Cop&iar<Tab>"+y
menutrans &Paste<Tab>"+gP		C&olar<Tab>"+gP
menutrans Put\ &Before<Tab>[p		Colocar\ &antes<Tab>[p
menutrans Put\ &After<Tab>]p		Co&locar\ depois<Tab>]p
menutrans &Delete<Tab>x			Apa&gar<Tab>x
menutrans &Select\ all<Tab>ggVG		&Selecionar\ tudo<Tab>ggVG
menutrans &Find\.\.\.			&Procurar\.\.\.
menutrans &Find<Tab>/			&Procurar<Tab>/
menutrans Find\ and\ Rep&lace\.\.\.	Procurar\ e\ substit&uir\.\.\.
menutrans Find\ and\ Rep&lace<Tab>:%s	Procurar\ e\ substit&uir<Tab>:%s
menutrans Find\ and\ Rep&lace		Procurar\ e\ substit&uir
menutrans Find\ and\ Rep&lace<Tab>:s	Procurar\ e\ substituir<Tab>:s
menutrans Settings\ &Window		Op��es\ de\ &janela
menutrans Startup\ &Settings		Op��es\ de\ i&nicializa��o

" Edit/Global Settings
menutrans &Global\ Settings		Op��es\ glo&bais

menutrans Toggle\ Pattern\ &Highlight<Tab>:set\ hls!	Ativar/Desativar\ &Realce\ de\ Padr�es<Tab>:set\ hls!
menutrans Toggle\ &Ignoring\ Case<Tab>:set\ ic!		Ativar/Desativar\ &Ignorar\ mai�sculas<Tab>:set\ ic!
menutrans Toggle\ &Showing\ Matched\ Pairs<Tab>:set\ sm!		Ativar/Desativar\ &coincid�ncias<Tab>:set\ sm!

menutrans &Context\ lines		Linhas\ de\ C&ontexto

menutrans &Virtual\ Edit		Edi��o\ &Virtual
menutrans Never				Nunca
menutrans Block\ Selection		Sele��o\ de\ Bloco
menutrans Insert\ mode			Modo\ de\ inser��o
menutrans Block\ and\ Insert		Bloco\ e\ inser��o
menutrans Always			Sempre

menutrans Toggle\ Insert\ &Mode<Tab>:set\ im! Ativar/Desativar\ Modo\ de\ In&ser��o<Tab>:set\ im!
menutrans Toggle\ Vi\ C&ompatibility<Tab>:set\ cp! Ativar/Desativar\ Co&mpatibilidade\ com\ Vi<Tab>:set\ cp!
menutrans Search\ &Path\.\.\.		Camin&ho\ de\ pesquisa\.\.\.
menutrans Ta&g\ Files\.\.\.		Arquivos\ de\ Tags\.\.\.

" GUI options
menutrans Toggle\ &Toolbar		Ocultar/Exibir\ Barra\ de\ &Ferramentas
menutrans Toggle\ &Bottom\ Scrollbar	Ocultar/Exibir\ Barra\ de\ &Rolagem\ Inferior
menutrans Toggle\ &Left\ Scrollbar	Ocultar/Exibir\ Barra\ de\ R&olagem\ Esquerda
menutrans Toggle\ &Right\ Scrollbar	Ocultar/Exibir\ Barra\ de\ Ro&lagem\ Direita
let g:menutrans_path_dialog = "Digite um caminho de procura para os arquivos.\nSepare os nomes dos diret�rios com uma v�rgula."
let g:menutrans_tags_dialog = "Digite os nomes dos arquivos de tags.\nSepare os nomes com uma v�rgula."

" Edit/File Settings
menutrans F&ile\ Settings		Op��es\ do\ ar&quivo

" Boolean options
menutrans Toggle\ Line\ &Numbering<Tab>:set\ nu!	Ativar/Desativar\ &numera��o\ de\ linhas<Tab>:set\ nu!
menutrans Toggle\ Relati&ve\ Line\ Numbering<Tab>:set\ rnu!	Ativar/Desativar\ numera��o\ relati&va\ de\ linha<Tab>:set\ rnu!
menutrans Toggle\ &List\ Mode<Tab>:set\ list!		Ativar/Desativar\ modo\ &lista<Tab>:set\ list!
menutrans Toggle\ Line\ &Wrapping<Tab>:set\ wrap!		Ativar/Desativar\ &quebra\ de\ linhas<Tab>:set\ wrap!
menutrans Toggle\ W&rapping\ at\ Word<Tab>:set\ lbr!	Ativar/Desativar\ quebra\ na\ &palavra<Tab>:set\ lbr!
menutrans Toggle\ Tab\ &Expanding<Tab>:set\ et!		Ativar/Desativar\ expans�o\ de\ tabs<Tab>:set\ et!
menutrans Toggle\ &Auto\ Indenting<Tab>:set\ ai!		Ativar/Desativar\ &auto-indenta��o<Tab>:set\ ai!
menutrans Toggle\ &C-Style\ Indenting<Tab>:set\ cin!		Ativar/Desativar\ indenta��o\ estilo\ &C<Tab>:set\ cin!

" other options
menutrans &Shiftwidth			Largura\ da\ &indenta��o

menutrans Soft\ &Tabstop		&Tabula��o\ com\ espa�os

menutrans Te&xt\ Width\.\.\.		Largura\ do\ te&xto\.\.\.
let g:menutrans_textwidth_dialog = "Digite a nova largura do texto (0 para desativar a formata��o): "

menutrans &File\ Format\.\.\.		&Formato\ do\ arquivo\.\.\.
let g:menutrans_fileformat_dialog = "Selecione o formato para gravar o arquivo"
let g:menutrans_fileformat_choices = " &Unix \n &Dos \n &Mac \n &Cancelar "

menutrans C&olor\ Scheme		&Esquema\ de\ cores
menutrans default	padr�o
menutrans Show\ C&olor\ Schemes\ in\ Menu	Mostrar\ &esquema\ de\ cores\ no\ menu
menutrans Select\ Fo&nt\.\.\.		Selecionar\ fo&nte\.\.\.

menutrans &Keymap	&Mapa\ de\ teclado
menutrans Show\ &Keymaps\ in\ Menu		Mostrar\ &mapa\ de\ teclado\ no\ menu
menutrans None		Nenhum

" Programming menu
menutrans &Tools			&Ferramentas
menutrans &Jump\ to\ this\ tag<Tab>g^]	&Pular\ para\ esse\ tag<Tab>g^]
menutrans Jump\ &back<Tab>^T		&Voltar<Tab>^T
menutrans Build\ &Tags\ File		&Criar\ arquivo\ de\ tags
menutrans &Spelling			&Ortografia
menutrans &Folding			&Dobra
menutrans &Make<Tab>:make		&Make<Tab>:make
menutrans &List\ Errors<Tab>:cl		&Lista\ de\ erros<Tab>:cl
menutrans L&ist\ Messages<Tab>:cl!	Li&sta\ de\ mensagens<Tab>:cl!
menutrans &Next\ Error<Tab>:cn		P&r�ximo\ erro<Tab>:cn
menutrans &Previous\ Error<Tab>:cp	&Erro\ anterior<Tab>:cp
menutrans &Older\ List<Tab>:cold	Listar\ erros\ &antigos<Tab>:cold
menutrans N&ewer\ List<Tab>:cnew	Listar\ erros\ &novos<Tab>:cnew
menutrans Error\ &Window		&Janela\ de\ erros
menutrans Se&t\ Compiler		Def&inir\ Compilador
menutrans &Convert\ to\ HEX<Tab>:%!xxd	Converter\ para\ hexadecimal<Tab>:%!xxd
menutrans Conve&rt\ back<Tab>:%!xxd\ -r	Conver&ter\ de\ volta<Tab>:%!xxd\ -r

" Tools.Spelling menu
menutrans &Spell\ Check\ On		&Ativar\ Corre��o\ Ortogr�fica
menutrans Spell\ Check\ &Off		&Desativar\ Corre��o\ Ortogr�fica
menutrans To\ &Next\ error<Tab>]s	&Pr�ximo\ Erro<Tab>]s
menutrans To\ &Previous\ Error<Tab>[s	Erro\ A&nterior<Tab>[s
menutrans Suggest\ &Corrections<Tab>z=	&Sugerir\ Corre��es<Tab>z=
menutrans &Repeat\ correction<Tab>:spellrepall	&Repetir\ Corre��o<Tab>:spellrepall

menutrans Set\ language\ to\ "en"               Ingl�s
menutrans Set\ language\ to\ "en_au"            Ingl�s\ (en_au)
menutrans Set\ language\ to\ "en_ca"            Ingl�s\ (en_ca)
menutrans Set\ language\ to\ "en_gb"            Ingl�s\ (en_gb)
menutrans Set\ language\ to\ "en_nz"            Ingl�s\ (en_nz)
menutrans Set\ language\ to\ "en_us"            Ingl�s\ (en_us)

menutrans &Find\ More\ Languages    	&Procurar\ mais\ idiomas

let g:menutrans_set_lang_to = "Alterar idioma para"
" Tools.Fold Menu
menutrans &Enable/Disable\ folds<Tab>zi		&Ativar/Desativar\ dobras<Tab>zi
menutrans &View\ Cursor\ Line<Tab>zv		&Ver\ linha\ do\ cursor<Tab>zv
menutrans Vie&w\ Cursor\ Line\ only<Tab>zMzx	Ve&r\ somente\ linha\ do\ cursor<Tab>zMzx
menutrans C&lose\ more\ folds<Tab>zm		&Fechar\ mais\ dobras<Tab>zm
menutrans &Close\ all\ folds<Tab>zM		F&echar\ todas\ as\ dobras<Tab>zM
menutrans O&pen\ more\ folds<Tab>zr		A&brir\ mais\ dobras<Tab>zr
menutrans &Open\ all\ folds<Tab>zR		Abr&ir\ todas\ as\ dobras<Tab>zR
" fold method
menutrans Fold\ Met&hod				&Modo\ de\ dobras
menutrans M&anual	&Manual
menutrans I&ndent	&Indenta��o
menutrans E&xpression	&Express�o
menutrans S&yntax	&Sintaxe
menutrans &Diff		Di&ff
menutrans Ma&rker	Ma&rcadores
menutrans Create\ &Fold<Tab>zf			Criar\ &dobras<Tab>zf
menutrans &Delete\ Fold<Tab>zd			Remover\ d&obras<Tab>zd
menutrans Delete\ &All\ Folds<Tab>zD		Remover\ &todas\ as\ dobras<Tab>zD
" moving around in folds
menutrans Fold\ col&umn\ width			&Largura\ da\ coluna\ da\ dobra

" Tools.Diff Menu
menutrans &Update	&Atualizar
menutrans &Get\ Block	&Obter\ Bloco
menutrans &Put\ Block	&P�r\ Bloco

" Tools.Error Menu
menutrans &Update<Tab>:cwin	&Atualizar<Tab>:cwin
menutrans &Open<Tab>:copen	A&brir<Tab>:copen
menutrans &Close<Tab>:cclose	&Fechar<Tab>:cclose

" Setup the Tools.Compiler submenu
menutrans Se&t\ Compiler		Def&inir\ compilador
menutrans Show\ Compiler\ Se&ttings\ in\ Menu	Mos&trar\ configura��es\ do\ compilador\ no\ menu
" Names for buffer menu.
menutrans &Buffers		&Buffers
menutrans &Refresh\ menu	A&tualizar\ menu
menutrans &Delete		&Apagar
menutrans &Alternate		A&lternar
menutrans &Next			P&r�ximo
menutrans &Previous		A&nterior
let g:menutrans_no_file = "[Sem arquivos]"

" Window menu
menutrans &Window			&Janela
menutrans &New<Tab>^Wn			&Nova<Tab>^Wn
menutrans S&plit<Tab>^Ws		&Dividir<Tab>^Ws
menutrans Sp&lit\ To\ #<Tab>^W^^	D&ividir\ para\ #<Tab>^W^^
menutrans Split\ &Vertically<Tab>^Wv	Dividir\ &verticalmente<Tab>^Wv
menutrans Split\ File\ E&xplorer	&Abrir\ Gerenciador\ de\ arquivos
menutrans &Close<Tab>^Wc		&Fechar<Tab>^Wc
menutrans Close\ &Other(s)<Tab>^Wo	Fechar\ &outra(s)<Tab>^Wo
menutrans Move\ &To			Mover\ &para
menutrans &Top<Tab>^WK			A&cima<Tab>^WK
menutrans &Bottom<Tab>^WJ		A&baixo<Tab>^WJ
menutrans &Left\ side<Tab>^WH		Lado\ &esquerdo<Tab>^WH
menutrans &Right\ side<Tab>^WL		Lado\ di&reito<Tab>^WL
menutrans Rotate\ &Up<Tab>^WR		&Girar\ para\ cima<Tab>^WR
menutrans Rotate\ &Down<Tab>^Wr		Girar\ para\ &baixo<Tab>^Wr
menutrans &Equal\ Size<Tab>^W=		Mesmo\ &Tamanho<Tab>^W=
menutrans &Max\ Height<Tab>^W_		Altura\ &M�xima<Tab>^W_
menutrans M&in\ Height<Tab>^W1_		&Altura\ m�nima<Tab>^W1_
menutrans Max\ &Width<Tab>^W\|		Larg&ura\ M�xima<Tab>^W\|
menutrans Min\ Widt&h<Tab>^W1\|		&Largura\ m�nima<Tab>^W1\|

" The popup menu
menutrans &Undo			&Desfazer
menutrans Cu&t			Recor&tar
menutrans &Copy			&Copiar
menutrans &Paste		Co&lar
menutrans &Delete		&Apagar
menutrans Select\ Blockwise	Selecionar\ bloco\ a\ bloco
menutrans Select\ &Word		Selecionar\ &Palavra
menutrans Select\ &Sentence	Selecionar\ &frase
menutrans Select\ Pa&ragraph	Selecionar\ pa&r�grafo
menutrans Select\ &Line		Selecionar\ L&inha
menutrans Select\ &Block	Selecionar\ &bloco
menutrans Select\ &All		Selecionar\ T&udo
let g:menutrans_spell_change_ARG_to = 'Alterar\ "%s"\ para'
let g:menutrans_spell_add_ARG_to_word_list = 'Adicionar\ "%s"\ �\ lista\ de\ palavras'
let g:menutrans_spell_ignore_ARG = 'Ignorar\ "%s"'

" The GUI toolbar
if has("toolbar")
  if exists("*Do_toolbar_tmenu")
    delfun Do_toolbar_tmenu
  endif
  fun Do_toolbar_tmenu()
	  tmenu ToolBar.Open	Abrir Arquivo
	  tmenu ToolBar.Save	Salvar Arquivo
	  tmenu ToolBar.SaveAll	Salvar Todos os arquivos
	  tmenu ToolBar.Print	Imprimir
	  tmenu ToolBar.Undo	Desfazer
	  tmenu ToolBar.Redo	Refazer
	  tmenu ToolBar.Cut	Recortar
	  tmenu ToolBar.Copy	Copiar
	  tmenu ToolBar.Paste	Colar
	  tmenu ToolBar.Find	Procurar...
	  tmenu ToolBar.FindNext	Procurar Pr�ximo
	  tmenu ToolBar.FindPrev	Procurar Anterior
	  tmenu ToolBar.Replace		Procurar e Substituir
	  if 0	" disable; these are in the Windoze menu
		  tmenu ToolBar.New	Nova Janela
		  tmenu ToolBar.WinSplit	Dividir Janela
		  tmenu ToolBar.WinMax		Janela M�xima
		  tmenu ToolBar.WinMin		Janela M�nima
		  tmenu ToolBar.WinVSplit	Dividir Verticalmente
		  tmenu ToolBar.WinMaxWidth	Largura M�xima
		  tmenu ToolBar.WinMinWidth	Largura M�nima
		  tmenu ToolBar.WinClose	Fechar Janela
	  endif
	  tmenu ToolBar.LoadSesn	Carregar Sess�o
	  tmenu ToolBar.SaveSesn	Salvar Sess�o
	  tmenu ToolBar.RunScript	Executar script
	  tmenu ToolBar.Make		Make
	  tmenu ToolBar.Shell		Abrir um shell
	  tmenu ToolBar.RunCtags	Gerar um arquivo de tags
	  tmenu ToolBar.TagJump		Saltar para um tag
	  tmenu ToolBar.Help		Ajuda
	  tmenu ToolBar.FindHelp	Procurar na Ajuda
  endfun
endif

" Syntax menu
menutrans &Syntax			&Sintaxe
"menutrans &Show\ individual\ choices	E&xibir\ escolhas\ individuais
menutrans &Show\ filetypes\ in\ menu	E&xibir\ tipos\ de\ arquivos\ no\ menu
menutrans Set\ '&syntax'\ only		Ativar\ somente\ s&intaxe
menutrans Set\ '&filetype'\ too		Ativar\ tamb�m\ &tipo\ de\ arquivo
menutrans &Off				&Desativar
menutrans &Manual			&Manual
menutrans A&utomatic			A&utom�tica
menutrans On/Off\ for\ &This\ file	Ativar/Desativar\ nesse\ &arquivo
menutrans &Show\ File\ Types\ in\ Menu		Mos&trar\ tipos\ de\ arquivos\ no\ menu
menutrans Co&lor\ test			T&estar\ cores
menutrans &Highlight\ test		Testar\ &realce
menutrans &Convert\ to\ HTML		Converter\ para\ &HTML

" Find Help dialog text
let g:menutrans_help_dialog = "Digite um comando ou palavra para obter ajuda;\n\nPreceder i_ para comandos de entrada (ex.: i_CTRL-X)\nPreceder c_ para comandos da linha de comandos (ex.: c_<Del>)\nPreceder ` para nome de op��o (ex.: `shiftwidth`)"

let &cpo = s:keepcpo
unlet s:keepcpo
