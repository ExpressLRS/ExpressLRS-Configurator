#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals, division  # Python2.7


import sqlite3 as sqlite
import sys
import os
import locale
import csv
import datetime
import io
import codecs
import shlex  # Simple lexical analysis

try:  # We are Python 3.3+
    from tkinter import *
    from tkinter import font, ttk, filedialog, messagebox
    from tkinter.ttk import *
except:  # or we are still Python2.7
    from Tkinter import *
    import Tkinter as tkinter
    import tkFont as font
    import tkFileDialog as filedialog
    import tkMessageBox as messagebox
    from ttk import *
    import ttk as ttk


class App:
    """the GUI graphic application"""
    def __init__(self):
        """create a tkk graphic interface with a main window tk_win"""
        self.__version__ = '0.9.1'
        self._title = "2019-06-16a : 'Support un-named Tabs!'"
        self.conn = None  # Baresql database object
        self.database_file = ""
        self.tk_win = Tk()
        self.tk_win.title('A graphic SQLite Client in 1 Python file')
        self.tk_win.option_add('*tearOff', FALSE)   # hint of tk documentation
        self.tk_win.minsize(600, 200)               # minimal size

        self.font_size = 10
        self.font_wheight = 0
        self.initialdir = "."
        # With a Menubar and Toolbar
        self.create_menu()
        self.create_toolbar()

        # Create style "ButtonNotebook"
        self.create_style()
        # Initiate Drag State
        self.state_drag = False
        self.state_drag_index = 0

        # With a Panedwindow of two frames: 'Database' and 'Queries'
        p = ttk.Panedwindow(self.tk_win, orient=HORIZONTAL)
        p.pack(fill=BOTH, expand=1)

        f_database = ttk.Labelframe(p, text='Databases', width=200, height=100)
        p.add(f_database)
        f_queries = ttk.Labelframe(p, text='Queries', width=200, height=100)
        p.add(f_queries)

        # build tree view 't' inside the left 'Database' Frame
        self.db_tree = ttk.Treeview(f_database, displaycolumns=[],
                                    columns=("detail", "action"))
        self.db_tree.tag_configure("run")
        self.db_tree.pack(fill=BOTH, expand=1)

        # create a  notebook 'n' inside the right 'Queries' Frame
        self.n = NotebookForQueries(self.tk_win, f_queries, [])

        # Bind keyboard shortcuts
        self.tk_win.bind('<F9>', self.run_tab)

    def create_menu(self):
        """create the menu of the application"""
        menubar = Menu(self.tk_win)
        self.tk_win['menu'] = menubar

        # feeding the top level menu
        self.menu = Menu(menubar)
        menubar.add_cascade(menu=self.menu, label='Database')
        self.menu_help = Menu(menubar)
        menubar.add_cascade(menu=self.menu_help, label='?')

        # feeding database sub-menu
        self.menu.add_command(label='New Database', command=self.new_db)
        self.menu.add_command(label='New In-Memory Database',
                              command=lambda: self.new_db(":memory:"))
        self.menu.add_command(label='Open Database ...',
                              command=self.open_db)
        self.menu.add_command(label='Open Database ...(legacy auto-commit)',
                              command=lambda: self.open_db(""))
        self.menu.add_command(label='Close Database', command=self.close_db)
        self.menu.add_separator()
        self.menu.add_command(label='Attach Database', command=self.attach_db)
        self.menu.add_separator()
        self.menu.add_command(label='Quit', command=self.quit_db)

        self.menu_help.add_command(label='about',
             command=lambda: messagebox.showinfo(message="""
             \nSQLite_bro : a graphic SQLite Client in 1 Python file
             \n("""+self.__version__+") " + self._title+"""
             \n(https://github.com/stonebig/sqlite_bro)"""))

    def create_toolbar(self):
        """create the toolbar of the application"""
        self.toolbar = Frame(self.tk_win, relief=RAISED)
        self.toolbar.pack(side=TOP, fill=X)
        self.tk_icon = self.get_tk_icons()

        # list of (image, action, tooltip) :
        to_show = [
           ('refresh_img', self.actualize_db, "Actualize databases"),
           ('run_img', self.run_tab, "Run script selection"),
           ('newtab_img', lambda x=self: x.n.new_query_tab("___", ""),
            "Create a new script"),
           ('csvin_img', self.import_csvtb, "Import a CSV file into a table"),
           ('csvex_img', self.export_csvtb,
            "Export selected table to a CSV file"),
           ('dbdef_img', self.savdb_script,
            "Save main database as a SQL script"),
           ('qryex_img', self.export_csvqr,
            "Export script selection to a CSV file"),
           ('exe_img', self.exsav_script,
            "Run script+output to a file (First 200 rec. per Qry)"),
           ('sqlin_img', self.load_script, "Load a SQL script file"),
           ('sqlsav_img', self.sav_script, "Save a SQL script in a file"),
           ('chgsz_img', self.chg_fontsize, "Modify font size")]

        for img, action, tip in to_show:
            b = Button(self.toolbar, image=self.tk_icon[img], command=action)
            b.pack(side=LEFT, padx=2, pady=2)
            self.createToolTip(b, tip)

    def set_initialdir(self, proposal):
        """change initial dir, if possible"""
        if os.path.isfile(proposal):
            self.initialdir = os.path.dirname(proposal)

    def new_db(self, filename=''):
        """create a new database"""
        if filename == '':
            filename = filedialog.asksaveasfilename(
                initialdir=self.initialdir, defaultextension='.db',
                title="Define a new database name and location",
                filetypes=[("default", "*.db"), ("other", "*.db*"),
                           ("all", "*.*")])
        if filename != '':
            self.database_file = filename
            if os.path.isfile(filename):
                self.set_initialdir(filename)
                if messagebox.askyesno(
                   message='Confirm Destruction of previous Datas ?',
                   icon='question', title='Destroying'):
                    os.remove(filename)
            self.conn = Baresql(self.database_file)
            self.actualize_db()

    def open_db(self, isolation_level=None):
        """open an existing database"""
        filename = filedialog.askopenfilename(
            initialdir=self.initialdir, defaultextension='.db',
            filetypes=[("default", "*.db"), ("other", "*.db*"),
                       ("all", "*.*")])
        if filename != '':
            self.set_initialdir(filename)
            self.database_file = filename
            self.conn = Baresql(self.database_file)
            self.actualize_db()

    def load_script(self):
        """load a script file, ask validation of detected Python code"""
        filename = filedialog.askopenfilename(
            initialdir=self.initialdir, defaultextension='.sql',
            filetypes=[("default", "*.sql"), ("other", "*.txt"),
                       ("all", "*.*")])
        if filename != '':
            self.set_initialdir(filename)
            text = os.path.split(filename)[1].split(".")[0]
            with io.open(filename, encoding=guess_encoding(filename)[0]) as f:
                script = f.read()
                sqls = self.conn.get_sqlsplit(script, remove_comments=True)
                dg = [s for s in sqls if s.strip(' \t\n\r')[:5] == "pydef"]
                if dg:
                    fields = ['', ['In Script File:', filename, 'r', 100], '',
                              ["Python Script", "".join(dg), 'r', 80, 20]]

                    create_dialog(("Ok for this Python Code ?"), fields,
                                  ("Confirm", self.load_script_ok),
                                  [text, script])
                else:
                    new_tab_ref = self.n.new_query_tab(text, script)

    def load_script_ok(self, thetop, entries, actions):
        """continue loading of script after confirmation dialog"""
        new_tab_ref = self.n.new_query_tab(*actions)
        thetop.destroy()

    def savdb_script(self):
        """save database as a script file"""
        filename = filedialog.asksaveasfilename(
            initialdir=self.initialdir, defaultextension='.db',
            title="save database structure in a text file",
            filetypes=[("default", "*.sql"), ("other", "*.txt"),
                       ("all", "*.*")])
        if filename != '':
            self.set_initialdir(filename)
            with io.open(filename, 'w', encoding='utf-8') as f:
                for line in self.conn.iterdump():
                    f.write('%s\n' % line)

    def sav_script(self):
        """save a script in a file"""
        active_tab_id = self.n.notebook.select()
        if active_tab_id != '':
            # get current selection (or all)
            fw = self.n.fw_labels[active_tab_id]
            script = fw.get(1.0, END)[:-1]
            filename = filedialog.asksaveasfilename(
                initialdir=self.initialdir, defaultextension='.db',
                title="save script in a sql file",
                filetypes=[("default", "*.sql"), ("other", "*.txt"),
                           ("all", "*.*")])
        if filename != "":
            self.set_initialdir(filename)
            with io.open(filename, 'w', encoding='utf-8') as f:
                if "你好 мир Artisou à croute" not in script:
                    f.write("/*utf-8 tag : 你好 мир Artisou à croute*/\n")
                f.write(script)

    def attach_db(self):
        """attach an existing database"""
        filename = filedialog.askopenfilename(
            initialdir=self.initialdir, defaultextension='.db',
            title="Choose a database to attach ",
            filetypes=[("default", "*.db"), ("other", "*.db*"),
                       ("all", "*.*")])
        attach = os.path.basename(filename).split(".")[0]
        avoid = {i[1]: 0 for i in get_leaves(self.conn, 'attached_databases')}
        att, indice = attach, 0
        while attach in avoid:
            attach, indice = att + "_" + str(indice), indice + 1
        if filename != '':
            self.set_initialdir(filename)
            attach_order = "ATTACH DATABASE '%s' as '%s' " % (filename, attach)
            self.conn.execute(attach_order)
            self.actualize_db()

    def close_db(self):
        """close the database"""
        self.conn.close
        self.new_db(":memory:")
        self.actualize_db()

    def actualize_db(self):
        """refresh the database view"""
        # bind double-click for easy user interaction
        self.db_tree.tag_bind('run', '<Double-1>', self.t_doubleClicked)
        self.db_tree.tag_bind('run_up', '<Double-1>', self.t_doubleClicked)

        # delete existing tree entries before re-creating them
        for node in self.db_tree.get_children():
            self.db_tree.delete(node)
        # create top node
        dbtext = os.path.basename(self.database_file)
        id0 = self.db_tree.insert(
            "", 0, "Database", text="main (%s)" % dbtext, values=(dbtext, ""))
        # add Database Objects, by Category
        for categ in ['master_table', 'table', 'view', 'trigger', 'index',
                      'pydef']:
            self.feed_dbtree(id0, categ, "main")
        # for attached databases
        for att_db in self.feed_dbtree(id0, 'attached_databases'):
            # create another top node
            dbtext2, insert_position = att_db + " (Attached)", 'end'
            if att_db == "temp":
                dbtext2, insert_position = "temp (%s)" % dbtext, 0
            id0 = self.db_tree.insert("", insert_position, dbtext2,
                                      text=dbtext2, values=(att_db, ""))
            # add attached Database Objects, by Category
            for categ in ['master_table', 'table', 'view', 'trigger', 'index']:
                self.feed_dbtree(id0, categ, att_db)
        # update time of last refresh
        self.db_tree.heading('#0', text=(
            datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))

    def quit_db(self):
        """quit the application"""
        if messagebox.askyesno(message='Are you sure you want to quit ?',
                               icon='question', title='Quiting'):
            self.tk_win.destroy()

    def run_tab(self, event=None):
        """clear previous results and run current script of a tab"""
        active_tab_id = self.n.notebook.select()
        if active_tab_id != '':
            # remove previous results
            self.n.remove_treeviews(active_tab_id)
            # get current selection (or all)
            fw = self.n.fw_labels[active_tab_id]
            try:
                script = (fw.get('sel.first', 'sel.last'))
            except:
                script = fw.get(1.0, END)[:-1]
            self.create_and_add_results(script, active_tab_id)
            fw.focus_set()  # workaround bug http://bugs.python.org/issue17511

    def exsav_script(self):
        """write script commands + top results to a log file"""
        # idea from http://blog.mp933.fr/post/2014/05/15/Script-vs.-copy/paste
        active_tab_id = self.n.notebook.select()
        if active_tab_id != '':
            # get current selection (or all)
            fw = self.n.fw_labels[active_tab_id]
            script = fw.get(1.0, END)[:-1]
            filename = filedialog.asksaveasfilename(
                initialdir=self.initialdir, defaultextension='.db',
                title="execute Script + output in a log file",
                filetypes=[("default", "*.txt"), ("other", "*.log"),
                           ("all", "*.*")])
        if filename == "":
            return
        self.set_initialdir(filename)
        with io.open(filename, 'w', encoding='utf-8') as f:
            if "你好 мир Artisou à croute" not in script:
                f.write("/*utf-8 tag : 你好 мир Artisou à croute*/\n")
            self.create_and_add_results(script, active_tab_id, limit=99, log=f)
            fw.focus_set()  # workaround bug http://bugs.python.org/issue17511

    def chg_fontsize(self):
        """change the display font size"""
        sizes = [10, 13, 14]
        font_types = ["TkDefaultFont", "TkTextFont", "TkFixedFont",
                      "TkMenuFont", "TkHeadingFont", "TkCaptionFont",
                      "TkSmallCaptionFont", "TkIconFont", "TkTooltipFont"]
        ww = ['normal', 'bold']
        if self.font_size < max(sizes):
            self.font_size = min([i for i in sizes if i > self.font_size])
        else:
            self.font_size = sizes[0]
            self.font_wheight = 0

        ff = 'Helvetica' if self.font_size != min(sizes) else 'Courier'
        self.font_wheight = 0 if self.font_size == min(sizes) else 1
        for typ in font_types:
            default_font = font.nametofont(typ)
            default_font.configure(size=self.font_size,
                                   weight=ww[self.font_wheight], family=ff)

    def t_doubleClicked(self, event):
        """launch action when dbl_click on the Database structure"""
        # determine item to consider
        selitem = self.db_tree.focus()  # the item having the focus
        seltag = self.db_tree.item(selitem, "tag")[0]
        if seltag == "run_up":  # 'run-up' tag ==> dbl-click 1 level up
            selitem = self.db_tree.parent(selitem)
        # get final information : text, selection and action
        definition, action = self.db_tree.item(selitem, "values")
        tab_text = self.db_tree.item(selitem, "text")
        script = action + " limit 999 " if action != "" else definition

        # create a new tab and run it if action suggest it
        new_tab_ref = self.n.new_query_tab(tab_text, script)
        if action != '':
            self.run_tab()  # run the new_tab created

    def get_tk_icons(self):
        """return a dictionary of icon_in_tk_format, from B64 images"""
        # to create this base 64 from a toto.gif image of 24x24 size do :
        #    import base64
        #    b64 = base64.encodestring(open(r"toto.gif","rb").read())
        #    print("'gif_img': '''\\\n" + b64.decode("utf8") + "'''")
        icons = {
            'run_img': '''\
R0lGODdhGAAYAJkAADOqM////wCqMwAAACwAAAAAGAAYAAACM4SPqcvt7wJ8oU5W8025b9OFW0hO
5EmdKKauSosKL9zJC21FsK27kG+qfUC5IciITConBQA7
''',
            'exe_img': '''\
R0lGODdhGAAYALsAAP///zOqM/8AAGSJtqHA4Jyen3ul0+jo6Y6z2cLCwaSmpACqM4ODgmKGs4yM
jYOPniwAAAAAGAAYAAAEhBDISacqOBdWOy1HKB6F41mKwihH4r4kdypD0wx4rg8nUDSEoHAY5J0K
AyFiyWQaPY+kYUqtGp4dx26b60kE4LC3FwaPyeJOYM1ur8sCzxrgZovN6sDEHdYD4nkVb2BzPYUV
hIdyfouMi14BC5COgoqBHQttk5VumxJ1bJuZoJacpKE9EQA7
''',
            'refresh_img': '''\
R0lGODdhGAAYAJkAAP///zOqMwCqMwAAACwAAAAAGAAYAAACSoSPqcvt4aIJEFU5g7AUC9px1/JR
3yYy4LqAils2IZdFMzCP6nhLd2/j6VqHD+1RAQKLHVfC+VwtcT3pNKOTYjTC4SOK+YbH5EYBADs=
''',
            'newtab_img': '''\
R0lGODdhGAAYAJkAAP///56fnQAAAAAAACwAAAAAGAAYAAACSoSPqcsm36KDsj1R1d00840E4ige
3xWSo9YppRGwGKPGCUrXtfQCut3ouYC5IHEhTCSHRt4x5fytIlKSs0l9HpZKLcy7BXOhRUYBADs=
''',
            'csvin_img': '''\
R0lGODdhGAAYAMwAAPj4+AAAADOqM2FkZtjY2r7Awujo6V9gYeDg4b/Cwzc3N0pKSl9fX5GRkVVV
VXl6fKSmpLCxsouNkFdXV97d4N7e4N7g4IyMjZyen6SopwAAAAAAAAAAAAAAAAAAAAAAACwAAAAA
GAAYAAAFlSAgjkBgmuUZlONKii4br/MLv/Gt47ia/rYcT2bb0VowVFFF8+2K0KjUJqhOo1XBlaQV
Zbdc7Rc8ylrJ5THaa5YqFozBgOFQAMznl6FhsO37UwMEBgiFFRYIhANXBxgJBQUJkpAZi1MEBxAR
kI8REAMUVxIEcgcDpqYEElcODwSvsK8PllMLAxeQkA0DDmhvEwwLdmAhADs=
''',
            'csvex_img': '''\
R0lGODdhGAAYAMwAAPj4+AAAADOqM2FkZtjY2r7AwuDg4b/Cw+jo6V9gYTc3N0pKSlVVVV9fX5GR
kaSmpLCxsnl6fIuNkN7g4N7d4KSop4yMjZyen1dXVwAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAA
GAAYAAAFkiAgjkBgmuUZlONKii4br/MLv/Gt47ia/rYcT2bb0VowVFFF8+2K0Kh0JKhap1BrFZu9
cl9awZd03Y4BXvQ5DVUsGoNBg6FAm6MOhA3h4A4ICAaCBhOCCANYAxcHBQUHj44ViFMECQ8QjY0Q
DwMUWBIEcQkDo6MEElgMEQSsrawRk1MLAxaZBQ4DDGduGA0LdV8hADs=
''',
            'qryex_img': '''\
R0lGODdhGAAYAJkAAP///56fnQAAAP8AACwAAAAAGAAYAAACXIQPoporeR4yEtZ3J511e845zah1
oKV9WEQxqYOJX0rX9oDndp3jO6/7aXqDVOCIPB50Pk0yaQgCijSlITBt/p4B6ZbL3VkBYKxt7DTX
0BN2uowUw+NndVq+tk8KADs=
''',
            'sqlin_img': '''\
R0lGODdhGAAYALsAAP///46z2Xul02SJtp6fnenp6f8AAMLCwaHA4IODgoCo01RymIOPnmKGswAA
AAAAACwAAAAAGAAYAAAEkRDIOYm9N9G9SfngR2jclnhHqh7FWAKZF84uFxdr3pb3TPOWEy6n2tkG
jcZgyWw6OwOEdEqtIgYbRjTA7Xq/WIoW8S17wxOteR1AS9Ts8sI08Aru+Px9TknU9YB5fBN+AYGH
gxJ+dwoCjY+OCpKNiQAGBk6ZTgsGE5edLy+XlqOhop+gpiWoqqGoqa0Ur7CxABEAOw==
''',
            'sqlsav_img': '''\
R0lGODdhGAAYALsAAP///56fnZyen/8AAGSJtqHA4Hul0+jo6Y6z2cLCwaSmpIODgmKGs4yMjYOP
ngAAACwAAAAAGAAYAAAEgxDISacSOItVOxVHKB5C41mKsihH4r4kdyoEwxB4rhMnIDCFoHAY5J0E
BCFiyWQaPY6kYUqtGp6dxm6b60kG4LC3FwaPyeJzpzzwaDQTsbkTqNsx3zmgfapPAnt6Y3Z1Amlq
AoR3cF5+EoqFY4k9jpSAfQKSkJCDm4SZXpN9l5aUoB4RADs=
''',
            'dbdef_img': '''\
R0lGODdhGAAYAMwAAPj4+DOqM2SJtmFkZqHA4NjY2sLCwejo6b7Awpyen3ul046z2aSop+Dg4V9g
YZGRkaSmpLCxsouNkDc3N2dxekpKSlVVVYyMjWKGs4ODgnl6fJ+goYOPnl9fX0xMTAAAACwAAAAA
GAAYAAAFuCAgjuTIJGiaZGVLJkcsH9DjmgxzMYfh/4fVDcAQCDDGpNI4hGAI0KgUKhgmBNGFdrut
3jhYhXhMVnhdj6U6OWy7h4G4/O2Sx+n1OZ5kD5QmHgOCAx0TJXN3Iw8HLQc2InoAfiIUBQcNmJkN
BxSSiS0DCT8/CAYMA55DBQMQEQilCBGndBKrAw4Ot7kFEm+rG66vsRCob7WCube3vG8WGgXQ0dAa
nW8VAxfCCA8DFnsAExUWAxWGeCEAOw==
''',
            'chgsz_img': '''\
R0lGODdhGAAYAJkAAP///wAAADOqMwCqMywAAAAAGAAYAAACZISPGRvpb1iDRjy5KBBWYc0NXjQ9
A8cdDFkiZyiIwDpnCYqzCF2lr2rTHVKbDgsTJG52yE8R0nRSJA7qNOhpVbFPHhdhPF20w46S+f2h
xlzceksqu6ET7JwtLRrhwNt+1HdDUQAAOw==
''',
            'img_close': '''\
R0lGODlhCAAIAMIBAAAAADs7O4+Pj9nZ2Ts7Ozs7Ozs7Ozs7OyH+EUNyZWF0ZWQgd2l0aCBHSU1Q
ACH5BAEKAAQALAAAAAAIAAgAAAMVGDBEA0qNJyGw7AmxmuaZhWEU5kEJADs=
''',
            'img_closeactive': '''\
R0lGODlhCAAIAMIEAAAAAP/SAP/bNNnZ2cbGxsbGxsbGxsbGxiH5BAEKAAQALAAAAAAIAAgAAAMV
GDBEA0qNJyGw7AmxmuaZhWEU5kEJADs=
''',
            'img_closepressed': '''\
R0lGODdhCAAIAIgAAPAAAP///ywAAAAACAAIAAACDkyAeJYM7FR8Ex7aVpIFADs=
'''
        }
        return {k: PhotoImage(k, data=v) for k, v in icons.items()}

    def btn_chg_tab_ok(self, thetop, entries, actions):
        """chg a tab title"""
        widget, index = actions
        # build dico of result
        d = {f[0]: f[1]() for f in entries
             if not isinstance(f, (type('e'), type(u'e')))}

        title = d['new label'].strip()
        thetop.destroy()
        widget.tab(index, text=title)

    def btn_presstwice(self, event):
        """double-click on a tab definition to change label"""
        x, y, widget = event.x, event.y, event.widget
        elem = widget.identify(x, y)
        index = widget.index("@%d,%d" % (x, y))
        titre = widget.tab(index, 'text')
        # determine selected table
        actions = [widget, index]
        title = 'Changing Tab label'
        fields = ['', ['current label', (titre), 'r', 30], '',
            ['new label', titre, 'w', 30]]
        create_dialog(title, fields, ("Ok", self.btn_chg_tab_ok), actions)

    def btn_press(self, event):
        """button press over a widget with a 'close' element"""
        x, y, widget = event.x, event.y, event.widget
        elem = widget.identify(x, y)  # widget is the notebook
        if "close" in elem:  # close button function
            index = widget.index("@%d,%d" % (x, y))
            widget.state(['pressed'])
            widget.pressed_index = index
        else:  # move function
            index = widget.index("@%d,%d" % (x, y))
            self.state_drag = True
            self.state_drag_widgetid = widget.tabs()[index]
            self.state_drag_index = index

    def btn_Movex(self, event):
        """make the tab follows if button is pressed and mouse moves"""
        x, y, widget = event.x, event.y, event.widget
        elem = widget.identify(x, y)
        index = widget.index("@%d,%d" % (x, y))
        if self.state_drag:
            if self.state_drag_index != index:
                self.btn_Move(widget, self.state_drag_index, index)
                self.state_drag_index = index

    def btn_Move(self, notebook, old_index, new_index):
        """Move old_index tab to new_index position"""
        # stackoverflow.com/questions/11570786/tkinter-treeview-drag-and-drop
        if new_index != "":
            target_index = new_index
            if new_index >= len(notebook.tabs())-1:
                target_index = "end"
            titre = notebook.tab(old_index, 'text')
            notebook.forget(old_index)
            notebook.insert(target_index, self.state_drag_widgetid, text=titre)
            notebook.select(new_index)

    def btn_release(self, event):
            """button release over a widget with a 'close' element"""
            x, y, widget = event.x, event.y, event.widget
            elem = widget.identify(x, y)
            index = self.state_drag_index
            if "close" in elem or "label" in elem:
                index = widget.index("@%d,%d" % (x, y))
            if "close" in elem and widget.instate(['pressed']):
                if widget.pressed_index == index:
                    widget.forget(index)
                    widget.event_generate("<<NotebookClosedTab>>")
            if self.state_drag and elem.strip() != "":
                if self.state_drag_index != index:
                    self.btn_Move(widget, self.state_drag_index, index)
            self.state_drag = False

            if not widget.instate(['pressed']):
                return
            widget.state(["!pressed"])
            widget.pressed_index = None

    def create_style(self):
        """create a Notebook style with close button"""
        # from https://github.com/python-git/python/blob/master/Demo/tkinter/
        #             ttk/notebook_closebtn.py
        # himself from http://paste.tclers.tk/896
        style = ttk.Style()

        style.element_create("close", "image", "img_close",
            ("active", "pressed", "!disabled", "img_closepressed"),
            ("active", "!disabled", "img_closeactive"), border=6, sticky='')

        style.layout("ButtonNotebook", [
            ("ButtonNotebook.client", {"sticky": "nswe"})])
        style.layout("ButtonNotebook.Tab", [
            ("ButtonNotebook.tab", {"sticky": "nswe", "children":
                [("ButtonNotebook.padding", {"side": "top", "sticky": "nswe",
                                     "children":
                  [("ButtonNotebook.focus", {"side": "top", "sticky": "nswe",
                                       "children":
                    [("ButtonNotebook.label", {"side": "left", "sticky": ''}),
                 ("ButtonNotebook.close", {"side": "left", "sticky": ''})]
                    })]
                })]
            })]
        )

        self.tk_win.bind_class("TNotebook", "<ButtonPress-1>",
                               self.btn_press, True)
        self.tk_win.bind_class("TNotebook", "<ButtonRelease-1>",
                               self.btn_release)
        self.tk_win.bind_class("TNotebook", "<B1-Motion>", self.btn_Movex)
        self.tk_win.bind_class("TNotebook", "<Double-1>", self.btn_presstwice)

    def createToolTip(self, widget, text):
        """create a tooptip box for a widget."""
        # www.daniweb.com/software-development/python/code/234888/tooltip-box
        def enter(event):
            global tipwindow
            x = y = 0
            try:
                tipwindow = tipwindow
            except:
                tipwindow = None
            if tipwindow or not text:
                return
            x, y, cx, cy = widget.bbox("insert")
            x += widget.winfo_rootx() + 27
            y += widget.winfo_rooty() + 27
            # Creates a toplevel window
            tipwindow = tw = Toplevel(widget)
            # Leaves only the label and removes the app window
            tw.wm_overrideredirect(1)
            tw.wm_geometry("+%d+%d" % (x, y))
            label = Label(tw, text=text, justify=LEFT, background="#ffffe0",
                          relief=SOLID, borderwidth=1)
            label.pack(ipadx=1)

        def close(event):
            global tipwindow
            tw = tipwindow
            tipwindow = None
            if tw:
                tw.destroy()

        widget.bind("<Enter>", enter)
        widget.bind("<Leave>", close)

    def feed_dbtree(self, root_id, category, attached_db=""):
        """feed database treeview for category, return list of leaves names"""

        # prepare re-formatting functions for fields and database names
        def f(t): return ('"%s"' % t.replace('"', '""')) if t != "" else t

        def db(t): return ('"%s".' % t.replace('"', '""')) if t != "" else t
        attached = db(attached_db)

        # get Category list of [unique_name, name, definition, sub_category]
        tables = get_leaves(self.conn, category, attached_db)
        if len(tables) > 0:
            # level 1 : create  the "category" node (as Category is not empty)
            root_txt = "%s(%s)" % (attached, category)
            idt = self.db_tree.insert(
                root_id, "end", root_txt,
                text="%s (%s)" % (category, len(tables)), values=("", ""))
            for t_id, t_name, definition, sub_cat in tables:
                # level 2 : print object creation, and '(Definition)' if fields
                sql3 = ""
                if sub_cat != '':
                    # it's a table : prepare a Query with names of each column
                    sub_c = get_leaves(self.conn, sub_cat, attached_db, t_name)
                    colnames = [col[1] for col in sub_c]
                    columns = [col[1] + ' ' + col[2] for col in sub_c]
                    sql3 = 'select "'+'" , "'.join(colnames)+'" from ' + (
                        '%s%s' % (attached, f(t_name)))
                idc = self.db_tree.insert(
                    idt, "end", "%s%s" % (root_txt, t_id),
                    text=t_name, tags=('run',), values=(definition, sql3))
                if sql3 != "":
                    self.db_tree.insert(
                        idc, "end", ("%s%s;d" % (root_txt, t_id)),
                        text=['(Definition)'], tags=('run',),
                        values=(definition, ""))
                    # level 3 : Insert a line per column of the Table/View
                    for c in range(len(sub_c)):
                        self.db_tree.insert(
                          idc, "end", "%s%s%s" % (root_txt, t_id, sub_c[c][0]),
                          text=columns[c], tags=('run_up',), values=('', ''))
        return [i[1] for i in tables]

    def create_and_add_results(self, instructions, tab_tk_id,
                               limit=-1, log=None):
        """execute instructions and add them to given tab results"""
        a_jouer = self.conn.get_sqlsplit(instructions, remove_comments=False)
        # must read :https://www.youtube.com/watch?v=09tM18_st4I#t=1751
        # stackoverflow.com/questions/15856976/transactions-with-python-sqlite3
        isolation = self.conn.conn.isolation_level
        counter = 0
        shell_list = ['', '']
        if isolation == "":  # Sqlite3 and dump.py default don't match
            self.conn.conn.isolation_level = None  # right behavior
        cu = self.conn.conn.cursor()
        sql_error = False

        def beurk(r):
            """format data line log"""
            s = ['"' + s.replace('"', '""') + '"' if
                 isinstance(s, (type('e'), type(u'e'))) else str(s) for s in r]
            return "("+",".join(s)+")"

        def bip(c):
            """format instruction log header"""
            timing = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            return ("\n---------N°%s----------[" % counter + timing + "]\n\n")

        for instruction in a_jouer:
            if log is not None:  # write to logFile
                counter += 1
                log.write(bip(counter))
                log.write(instruction)
                log.write("\n")
            instru = next(self.conn.get_sqlsplit(instruction,
                                            remove_comments=True))
            instru = instru.replace(";", "").strip(' \t\n\r')
            first_line = (instru + "\n").splitlines()[0]
            if instru[:5] == "pydef":
                pydef = self.conn.createpydef(instru)
                titles = ("Creating embedded python function",)
                rows = self.conn.conn_def[pydef]['pydef'].splitlines()
                rows.append(self.conn.conn_def[pydef]['inst'])
                self.n.add_treeview(tab_tk_id, titles, rows, "Info", pydef)
                if log is not None:  # write to logFile
                    log.write("\n".join(['("%s")' % r for r in rows])+"\n")
            elif instru[:1] == ".":  # a shell command !
                # handle a ".function" here !
                # import FILE TABLE
                shell_list = shlex.split(instru)  # magic standard library
                try:
                    if shell_list[0] == '.import' and len(shell_list) >= 2:
                        csv_file = shell_list[1]
                        guess = guess_csv(csv_file)
                        if len(shell_list) >= 3:
                            guess.table_name = shell_list[2]
                        # Create csv reader and give it to import
                        reading = read_this_csv(csv_file,
                                                guess.encodings[0],
                                                guess.default_sep,
                                                guess.default_quote,
                                                guess.has_header,
                                                guess.default_decims[0])
                        guess_sql = guess_sql_creation(guess.table_name,
                                                       guess.default_sep, ".",
                                                       guess.has_header,
                                                       guess.dlines,
                                                       guess.default_quote)[0]
                        self.conn.insert_reader(reading, guess.table_name,
                                                guess_sql, create_table=False,
                                                replace=False)
                        self.n.add_treeview(tab_tk_id, ('table', 'file'),
                                            ((guess.table_name, csv_file),),
                                            "Info", first_line)
                    if log is not None:  # write to logFile
                        log.write('-- File %s imported in "%s"\n' % (
                                  csv_file, guess.table_name))
                except IOError as err:
                    msg = ("I/O error: {0}".format(err))
                    self.n.add_treeview(tab_tk_id, ('Error !',), [(msg,)],
                                        "Error !", instru)
                    if log is not None:  # write to logFile
                        log.write("Error ! %s : %s" % (msg, instru))
                    sql_error = True
                    break
            elif instruction != "":
                try:
                    if shell_list[0] == '.once':
                        shell_list[0] = ' '
                        encode_in = 'utf-8-sig' if os.name == 'nt' else 'utf-8'
                        self.conn.export_writer(instruction, shell_list[1],
                                                encoding=encode_in)
                        self.n.add_treeview(tab_tk_id, ('qry', 'file'),
                                            ((instruction, shell_list[1]),),
                                            "Info", ".once %s" % shell_list[1])
                    else:
                        cur = cu.execute(instruction)
                        rows = cur.fetchall()
                        # a query may have no result( like for an "update")
                        if cur.description is not None:
                            titles = [row_info[0] for
                                      row_info in cur.description]
                            self.n.add_treeview(
                                tab_tk_id, titles, rows, "Qry", first_line)
                            if log is not None:  # write to logFile
                                log.write(beurk(titles) + "\n")
                                log.write("\n".join(
                                    [beurk(l) for l in rows[:limit]]) + "\n")
                                if len(rows) > limit:
                                    log.write("%s more..." % len((rows)-limit))
                except sqlite.Error as msg:  # OperationalError
                    self.n.add_treeview(tab_tk_id, ('Error !',), [(msg,)],
                                        "Error !", first_line)
                    if log is not None:  # write to logFile
                        log.write("Error ! %s" % msg)
                    sql_error = True
                    break

        if self.conn.conn.isolation_level != isolation:
            # if we're in 'backward' compatible mode (automatic commit)
            try:
                if self.conn.conn.in_transaction:  # python 3.2
                    if not sql_error:
                        cu.execute("COMMIT;")
                        if log is not None:  # write to logFile
                            log.write("\n-------COMMIT;--------\n" % counter)
                    else:
                        cu.execute("ROLLBACK;")
            except:
                if not sql_error:
                    try:
                        cu.execute("COMMIT;")
                        if log is not None:  # write to logFile
                            log.write("\n-------COMMIT;--------\n" % counter)
                    except:
                        pass
                else:
                    try:
                        cu.execute("ROLLBACK;")
                    except:
                        pass
            self.conn.conn.isolation_level = isolation  # restore standard

    def import_csvtb(self):
        """import csv dialog (with guessing of encoding and separator)"""
        csv_file = filedialog.askopenfilename(
            initialdir=self.initialdir, defaultextension='.db',
            title="Choose a csv fileto import ",
            filetypes=[("default", "*.csv"), ("other", "*.txt"),
                       ("all", "*.*")])
        if csv_file != '':
            self.set_initialdir(csv_file)
            # guess all via an object
            guess = guess_csv(csv_file)
            guess_sql = guess_sql_creation(guess.table_name, guess.default_sep,
                                           ".", guess.has_header, guess.dlines,
                                           guess.default_quote)[2]
            # check it via dialog box
            fields_in = ['', ['csv Name', csv_file, 'r', 100], '',
                         ['table Name', guess.table_name],
                         ['column separator', guess.default_sep, 'w', 20],
                         ['string delimiter', guess.default_quote, 'w', 20],
                         '', ['Decimal separator', guess.default_decims],
                         ['Encoding', guess.encodings],
                         'Fliflaps', ['Header line', guess.has_header],
                         ['Create table', True],
                         ['Replace existing data', True], '',
                         ['first 3 lines', guess.dlines, 'r', 100, 10], '',
                         ['use manual creation request', False], '',
                         ['creation request', guess_sql, 'w', 100, 10]]
            actions = ([self.conn, self.actualize_db])
            create_dialog(("Importing %s" % csv_file), fields_in,
                          ("Import", import_csvtb_ok), actions)

    def export_csvtb(self):
        """get selected table definition and launch cvs export dialog"""
        # determine selected table
        actions = [self.conn, self.db_tree]
        selitem = self.db_tree.focus()  # get tree item having the focus
        if selitem != '':
            seltag = self.db_tree.item(selitem, "tag")[0]
            if seltag == "run_up":  # if 'run-up', do as dbl-click 1 level up
                selitem = self.db_tree.parent(selitem)
            # get final information
            definition, query = self.db_tree.item(selitem, "values")
            if query != "":  # run the export_csv dialog
                title = ('Export Table "%s" to ?' %
                         self.db_tree.item(selitem, "text"))
                self.export_csv_dialog(query, title, actions)

    def export_csvqr(self):
        """get tab selected definition and launch cvs export dialog"""
        actions = [self.conn, self.n]
        active_tab_id = self.n.notebook.select()
        if active_tab_id != '':  # get current selection (or all)
            fw = self.n.fw_labels[active_tab_id]
            try:
                query = fw.get('sel.first', 'sel.last')
            except:
                query = fw.get(1.0, END)[:-1]
            if query != "":
                self.export_csv_dialog(query, "Export Query", actions)

    def export_csv_dialog(self, query="--", text="undefined.csv", actions=[]):
        """export csv dialog"""
        # proposed encoding (we favorize utf-8 or utf-8-sig)
        encodings = ["utf-8", locale.getdefaultlocale()[1], "utf-16",
                     "utf-8-sig"]
        if os.name == 'nt':
            encodings = ["utf-8-sig", locale.getdefaultlocale()[1], "utf-16",
                         "utf-8"]
        # proposed csv separator
        default_sep = [",", "|", ";"]
        csv_file = filedialog.asksaveasfilename(
            initialdir=self.initialdir, defaultextension='.db', title=text,
            filetypes=[("default", "*.csv"), ("other", "*.txt"),
                       ("all", "*.*")])
        if csv_file != "":
            # Idea from (http://www.python-course.eu/tkinter_entry_widgets.php)
            fields = ['', ['csv Name', csv_file, 'r', 100], '',
                      ['column separator', default_sep],
                      ['Header line', True],
                      ['Encoding', encodings], '',
                      ["Data to export (MUST be 1 Request)",
                       (query), 'w', 100, 10]]

            create_dialog(("Export to %s" % csv_file), fields,
                          ("Export", export_csv_ok), actions)


class NotebookForQueries():
    """Create a Notebook with a list in the First frame
       and query results in following treeview frames """

    def __init__(self, tk_win, root, queries):
        self.tk_win = tk_win
        self.root = root
        self.notebook = Notebook(root, style="ButtonNotebook")  # ttk.

        self.fw_labels = {}  # tab_tk_id -> Scripting frame python object
        self.fw_result_nbs = {}  # tab_tk_id -> Notebook of Results

        # resize rules
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)
        # grid widgets
        self.notebook.grid(row=0, column=0, sticky=(N, W, S, E))

    def new_query_tab(self, title, query):
        """add a Tab 'title' to the notebook, containing the Script 'query'"""

        fw_welcome = ttk.Panedwindow(self.tk_win, orient=VERTICAL)  # tk_win
        fw_welcome.pack(fill='both', expand=True)
        self.notebook.add(fw_welcome, text=(title))

        # new "editable" script
        f1 = ttk.Labelframe(fw_welcome, text='Script', width=200, height=100)
        fw_welcome.add(f1)
        fw_label = Text(f1, bd=1, undo=True)

        scroll = ttk.Scrollbar(f1, command=fw_label.yview)
        fw_label.configure(yscrollcommand=scroll.set)
        fw_label.insert(END, (query))
        fw_label.pack(side=LEFT, expand=YES, fill=BOTH, padx=2, pady=2)
        scroll.pack(side=RIGHT, expand=NO, fill=BOTH, padx=2, pady=2)

        # keep tab reference  by tk id
        working_tab_id = "." + fw_welcome._name

        # keep tab reference to script (by tk id)
        self.fw_labels[working_tab_id] = fw_label

        # new "Results" Container
        fr = ttk.Labelframe(fw_welcome, text='Results', width=200, height=100)
        fw_welcome.add(fr)

        # containing a notebook
        fw_result_nb = Notebook(fr, style="ButtonNotebook")
        fw_result_nb.pack(fill='both', expand=True)
        # resize rules
        fw_welcome.columnconfigure(0, weight=1)
        # keep reference to result_nb objects (by tk id)
        self.fw_result_nbs[working_tab_id] = fw_result_nb

        # activate this tab print(self.notebook.tabs())
        self.notebook.select(working_tab_id)
        # workaround to have a visible result pane on initial launch
        self.add_treeview(
            working_tab_id, "_", "", "click on ('->') to run Script")
        return working_tab_id  # gives back tk_id reference of the new tab

    def del_tab(self):
        """delete active notebook tab's results"""
        given_tk_id = self.notebook.select()
        if given_tk_id != '':
            self.notebook.forget(given_tk_id)

    def remove_treeviews(self, given_tk_id):
        """remove results from given tab tk_id"""
        if given_tk_id != '':
            myz = self.fw_result_nbs[given_tk_id]
            for xx in list(myz.children.values()):
                xx.grid_forget()
                xx.destroy()

    def add_treeview(self, given_tk_id,  columns, data, title="__", subt=""):
        """add a dataset result to the given tab tk_id"""
        # ensure we work on lists
        if isinstance(columns, (type('e'), type(u'e'))):
            tree_columns = [columns]
        else:
            tree_columns = columns
        lines = [data] if isinstance(data, (type('e'), type(u'e'))) else data

        # get back reference to Notebooks of Results
        # (see http://www.astro.washington.edu/users/rowen/TkinterSummary.html)
        fw_result_nb = self.fw_result_nbs[given_tk_id]

        # create a Labelframe to contain new resultset and scrollbars
        f2 = ttk.Labelframe(
            fw_result_nb, text=('(%s lines) %s' % (len(lines), subt)),
            width=200, height=100)
        f2.pack(fill='both', expand=True)
        fw_result_nb.add(f2, text=title)

        # ttk.Style().configure('TLabelframe.label', font=("Arial",14, "bold"))
        # lines=queries
        fw_Box = Treeview(f2, columns=tree_columns, show="headings",
                          padding=(2, 2, 2, 2))
        fw_vsb = Scrollbar(f2, orient="vertical", command=fw_Box.yview)
        fw_hsb = Scrollbar(f2, orient="horizontal", command=fw_Box.xview)
        fw_Box.configure(yscrollcommand=fw_vsb.set, xscrollcommand=fw_hsb.set)
        fw_Box.grid(column=0, row=0, sticky='nsew', in_=f2)
        fw_vsb.grid(column=1, row=0, sticky='ns', in_=f2)
        fw_hsb.grid(column=0, row=2, sticky='ew', in_=f2)

        # this new Treeview  may occupy all variable space
        f2.grid_columnconfigure(0, weight=1)
        f2.grid_rowconfigure(0, weight=1)

        # feed Treeview Header
        for col in tuple(tree_columns):
            fw_Box.heading(
                col, text=col.title(),
                command=lambda c=col: self.sortby(fw_Box, c, 0))
            fw_Box.column(col, width=font.Font().measure(col.title()))

        def flat(x):
            """replace line_return by space, if given a string"""
            if isinstance(x, (type('e'), type(u'e'))):
                return x.replace("\n", " ")
            return x

        # feed Treeview Lines
        for items in lines:
            # if line is a string, redo a tuple
            item = (items,) if isinstance(items,
                                          (type('e'), type(u'e'))) else items

            # replace line_return by space (grid don't like line_returns)
            line_cells = tuple(flat(item[c]) for c in range(len(tree_columns)))
            # insert the line of data
            fw_Box.insert('', 'end', values=line_cells)
            # adjust columns length if necessary and possible
            for indx, val in enumerate(line_cells):
                try:
                    ilen = font.Font().measure(val)
                    if fw_Box.column(tree_columns[indx],
                                     width=None) < ilen and ilen < 400:
                        fw_Box.column(tree_columns[indx], width=ilen)
                except:
                    pass

    def sortby(self, tree, col, descending):
        """Sort a ttk treeview contents when a column is clicked on."""
        # grab values to sort
        data = [(tree.set(child, col), child) for child in tree.get_children()]

        # reorder data
        data.sort(reverse=descending)
        for indx, item in enumerate(data):
            tree.move(item[1], '', indx)

        # switch the heading so that it will sort in the opposite direction
        tree.heading(col, command=lambda col=col:
                     self.sortby(tree, col, int(not descending)))


class guess_csv():
    """guess everything about a csv file of data to import in SQL"""
    def __init__(self,  csv_file):
        self.has_header = True
        self.default_sep = ","
        self.default_quote = '"'
        self.encodings = guess_encoding(csv_file)
        self.table_name = os.path.basename(csv_file).split(".")[0]
        with io.open(csv_file, encoding=self.encodings[0]) as f:
            self.preview = f.read(9999)
            try:
                dialect = csv.Sniffer().sniff(self.preview)
                self.has_header = csv.Sniffer().has_header(self.preview)
                self.default_sep = dialect.delimiter
                self.default_quote = Dialect.quotechar
            except:
                pass  # sniffer can fail
        self.default_decims = [".", ","]
        if self.default_sep == ";":
            self.default_decims = [",", "."]
        self.dlines = "\n\n".join(self.preview.splitlines()[:3])


def guess_sql_creation(table_name, separ, decim, header, data, quoter='"'):
    """guess the sql creation request for the table who will receive data"""
    try:
        dlines = list(csv.reader(data.replace('\n\n', '\n').splitlines(),
                      delimiter=separ, quotechar=quoter))
    except:  # minimal hack for python2.7
        dlines = list(csv.reader(data.replace('\n\n', '\n').splitlines(),
                      delimiter=str(separ), quotechar=str(quoter)))
    r, val = list(dlines[0]), list(dlines[1])
    typ = ['TEXT']*len(r)  # default value is TEXT
    for i in range(len(r)):
        try:
            float(val[i].replace(decim, '.'))  # unless it can be a real
            typ[i] = 'REAL'
        except:
            checker = sqlite.connect(':memory:')
            # avoid the false positive 'now'
            val_not_now = val[i].replace('w', 'www').replace('W', 'WWW')
            test = "select datetime('{0}')".format(val_not_now)
            try:
                if checker.execute(test).fetchall()[0][0]:
                    typ[i] = 'DATETIME'  # and unless SQLite can see a DATETIME
            except:
                pass
            checker.close
    if header:
        # de-duplicate column names, if needed by pastixing with '_'+number
        for i in  range(len(r)):
            if r[i] in r[:i] :
                j=1
                while r[i]+'_'+str(j) in  r[:i] + r[i+1:]:
                    j +=1
                r[i]+= '_'+str(j)
        head = ",\n".join([('"%s" %s' % (r[i], typ[i]))
                           for i in range(len(r))])
        sql_crea = ('CREATE TABLE "%s" (%s);' % (table_name, head))
    else:
        head = ",".join(["c_" + ("000" + str(i))[-3:] for i in range(len(r))])
        sql_crea = ('CREATE TABLE "%s" (%s);' % (table_name, head))
    return sql_crea, typ, head


def guess_encoding(csv_file):
    """guess the encoding of the given file"""
    with io.open(csv_file, "rb") as f:
        data = f.read(5)
    if data.startswith(b"\xEF\xBB\xBF"):  # UTF-8 with a "BOM"
        return ["utf-8-sig"]
    elif data.startswith(b"\xFF\xFE") or data.startswith(b"\xFE\xFF"):
        return ["utf-16"]
    else:  # in Windows, guessing utf-8 doesn't work, so we have to try
        try:
            with io.open(csv_file, encoding="utf-8") as f:
                preview = f.read(222222)
                return ["utf-8"]
        except:
            return [locale.getdefaultlocale()[1], "utf-8"]


def create_dialog(title, fields_in, buttons, actions):
    """create a formular with title, fields, button, data"""
    # drawing the request form
    top = Toplevel()
    top.title(title)
    top.columnconfigure(0, weight=1)
    top.rowconfigure(0, weight=1)
    # drawing global frame
    content = ttk.Frame(top)
    content.grid(column=0, row=0, sticky=(N, S, E, W))
    content.columnconfigure(0, weight=1)
    # fields = Horizontal FrameLabel, or
    #         label, default_value, 'r' or 'w' default_width,default_height
    fields = fields_in
    mf_col = -1
    for f in range(len(fields)):  # same structure out
        field = fields[f]
        if isinstance(field, (type('e'), type(u'e'))) or mf_col == -1:
            # a new horizontal frame
            mf_col += 1
            ta_col = -1
            if isinstance(field, (type('e'), type(u'e'))) and field == '':
                mf_frame = ttk.Frame(content, borderwidth=1)
            else:
                mf_frame = ttk.LabelFrame(content, borderwidth=1, text=field)
            mf_frame.grid(column=0, row=mf_col, sticky='nsew')
            Grid.rowconfigure(mf_frame, 0, weight=1)
            content.rowconfigure(mf_col, weight=1)
        if not isinstance(field, (type('e'), type(u'e'))):
            # a new vertical frame
            ta_col += 1
            Grid.columnconfigure(mf_frame, ta_col, weight=1)
            packing_frame = ttk.Frame(mf_frame, borderwidth=1)
            packing_frame.grid(column=ta_col, row=0, sticky='nsew')
            Grid.columnconfigure(packing_frame, 0, weight=1)
            # prepare width and height and writable status
            width = field[3] if len(field) > 3 else 30
            height = field[4] if len(field) > 4 else 30
            status = "normal"
            if len(field) >= 3 and field[2] == "r":
                status = "disabled"
            # switch between object types
            if len(field) > 4:
                # datas
                d_frame = ttk.LabelFrame(packing_frame, borderwidth=5,
                                         width=width, height=height,
                                         text=field[0])
                d_frame.grid(column=0, row=0, sticky='nsew', pady=1, padx=1)
                Grid.rowconfigure(packing_frame, 0, weight=1)
                fw_label = Text(d_frame, bd=1, width=width, height=height,
                                undo=True)
                fw_label.pack(side=LEFT, expand=YES, fill=BOTH)
                scroll = ttk.Scrollbar(d_frame, command=fw_label.yview)
                scroll.pack(side=RIGHT, expand=NO, fill=Y)
                fw_label.configure(yscrollcommand=scroll.set)
                fw_label.insert(END, ("%s" % field[1]))
                fw_label.configure(state=status)
                Grid.rowconfigure(d_frame, 0, weight=1)
                Grid.columnconfigure(d_frame, 0, weight=1)
                # Data Text Extractor in the fields list ()
                # see stackoverflow.com/questions/17677649 (loop and lambda)
                fields[f][1] = lambda x=fw_label: x.get('1.0', 'end')
            elif isinstance(field[1], type(True)):
                # boolean Field
                name_var = BooleanVar()
                name = ttk.Checkbutton(packing_frame, text=field[0],
                                       variable=name_var, onvalue=True,
                                       state=status)
                name_var.set(field[1])
                name.grid(column=0, row=0, sticky='nsew', pady=5, padx=5)
                fields[f][1] = name_var.get
            else:  # Text or Combo
                namelbl = ttk.Label(packing_frame, text=field[0])
                namelbl.grid(column=0, row=0, sticky='nsw', pady=5, padx=5)
                name_var = StringVar()
                if not isinstance(field[1], (list, tuple)):
                    name = ttk.Entry(packing_frame, textvariable=name_var,
                                     width=width, state=status)
                    name_var.set(field[1])
                else:
                    name = ttk.Combobox(packing_frame, textvariable=name_var,
                                        state=status)
                    name['values'] = list(field[1])
                    name.current(0)
                name.grid(column=1, row=0, sticky='nsw', pady=0, padx=10)
                fields[f][1] = name_var.get
    # adding button below the same way
    mf_col += 1
    packing_frame = ttk.LabelFrame(content, borderwidth=5)
    packing_frame.grid(column=0, row=mf_col, sticky='nsew')
    okbutton = ttk.Button(
        packing_frame, text=buttons[0],
        command=lambda a=top, b=fields, c=actions: (buttons[1])(a, b, c))
    cancelbutton = ttk.Button(packing_frame, text="Cancel",
                              command=top.destroy)
    okbutton.grid(column=0, row=mf_col)
    cancelbutton.grid(column=1, row=mf_col)
    for x in range(3):
        Grid.columnconfigure(packing_frame, x, weight=1)
    top.grab_set()


def import_csvtb_ok(thetop, entries, actions):
    """read input values from tk formular"""
    conn, actualize_db = actions
    # build dico of result
    d = {f[0]: f[1]() for f in entries
         if not isinstance(f, (type('e'), type(u'e')))}
    # affect to variables
    csv_file = d['csv Name'].strip()
    table_name = d['table Name'].strip()
    separ = d['column separator']
    decim = d['Decimal separator']
    quotechar = d['string delimiter']
    # action
    if csv_file != "(none)" and len(csv_file)*len(table_name)*len(separ) > 1:
        thetop.destroy()
        # do initialization job
        sql, typ, head = guess_sql_creation(table_name, separ, decim,
                                            d['Header line'],
                                            d["first 3 lines"], quotechar)
        if d['use manual creation request']:
            sql = ('CREATE TABLE "%s" (%s);' %
                   (table_name, d["creation request"]))

        # Create csv reader function and give it to insert
        reading = read_this_csv(csv_file, d['Encoding'], separ,
                                quotechar, d['Header line'], decim)

        conn.insert_reader(reading, table_name, sql,
                           create_table=d['Create table'],
                           replace=d['Replace existing data'])
        # refresh
        actualize_db()


def read_this_csv(csv_file, encoding, delimiter , quotechar, header, decim):
    """yield csv data records from a file """
    # handle Python 2/3
    try:
        reader = csv.reader(open(csv_file, 'r', encoding=encoding),
                            delimiter=delimiter, quotechar=quotechar)
    except:  # minimal hack for 2.7
        reader = csv.reader(open(csv_file, 'r'),
                            delimiter=str(delimiter), quotechar=str(quotechar))
    # handle header
    if header:
        next(reader)
    # otherwise handle special decimal treatment
    for row in reader:
        if decim != "." and not isinstance(row, (type('e'), type(u'e'))):
                for i in range(len(row)):
                    row[i] = row[i].replace(decim, ".")
        yield(row)


def export_csv_ok(thetop, entries, actions):
    "export a csv table (action)"
    conn = actions[0]
    # build dico of result
    d = {f[0]: f[1]() for f in entries
         if not isinstance(f, (type('e'), type(u'e')))}

    csv_file = d['csv Name'].strip()
    conn.export_writer(d["Data to export (MUST be 1 Request)"], csv_file,
                       header=d['Header line'],
                       delimiter=d['column separator'],
                       encoding=d['Encoding'],
                       quotechar='"')


def get_leaves(conn, category, attached_db="", tbl=""):
    """returns a list of 'category' objects in attached_db
       [objectCode, objectLabel, Definition, 'sub-level']
    """
    # create formatting shortcuts
    def f(t): return ('"%s"' % t.replace('"', '""')) if t != "" else t

    def d(t): return ('%s.' % t) if t != "" else t

    # Initialize datas
    Tables, db, tb = [], d(attached_db), f(tbl)
    master = "sqlite_master" if db != "temp." else "sqlite_temp_master"

    if category == "pydef":  # pydef request is not sql, answer is direct
        Tables = [[k, k, v['pydef'], ''] for k, v in conn.conn_def.items()]
    elif category == 'attached_databases':
        # get all attached database, but not the first one ('main')
        resu = list((conn.execute("PRAGMA database_list").fetchall()))[1:]
        for c in resu:
            instruct = "ATTACH DATABASE %s as %s" % (f(c[2]), f(c[1]))
            Tables.append([c[0], c[1], instruct, ''])
    elif category == 'fields':
        resu = conn.execute("PRAGMA %sTABLE_INFO(%s)" % (db, tb)).fetchall()
        Tables = [[c[1], c[1], c[2], ''] for c in resu]
    elif category in ('index', 'trigger', 'master_table', 'table', 'view'):
        # others are 1 sql request that generates directly Tables
        if category in ('index', 'trigger'):
            sql = """SELECT '{0}' || name, name, coalesce(sql,'--auto') , ''
                  FROM {0}{3} WHERE type='{1}' ORDER BY name"""
        elif category == 'master_table':
            sql = """SELECT '{0}{3}', '{3}', '--auto', 'fields'
                   UNION SELECT '{0}'||name, name, sql, 'fields'
                  FROM {0}{3}
                  WHERE type='table' AND name LIKE 'sqlite_%' ORDER BY name"""
        elif category in ('table', 'view'):
            sql = """SELECT '{0}' || name, name, sql , 'fields'
                FROM {0}{3} WHERE type = '{1}' AND NOT
                (type='table' AND name LIKE 'sqlite_%') ORDER BY name"""
        Tables = list(conn.execute(sql.format(db, category, tbl,
                                              master)).fetchall())
    return Tables


class Baresql():
    """a small wrapper around sqlite3 module"""
    def __init__(self, connection="", keep_log=False, cte_inline=True,
                 isolation_level=None):
        self.dbname = connection.replace(":///", "://").replace(
            "sqlite://", "")
        self.conn = sqlite.connect(self.dbname,
                                   detect_types=sqlite.PARSE_DECLTYPES)
        # pydef and logging infrastructure
        self.conn_def = {}
        self.do_log = keep_log
        self.log = []
        self.conn.isolation_level = isolation_level  # commit experience

    def close(self):
        """close database and clear dictionnary of registered 'pydef'"""
        self.conn.close
        self.conn_def = {}

    def iterdump(self):
        """dump the database (add tweaks over the default dump)"""
        # force detection of utf-8 by placing an only utf-8 comment at top
        yield("/*utf-8 tag : 你好 мир Artisou à croute*/\n")
        # add the Python functions pydef
        for k in self.conn_def.values():
            yield(k['pydef'] + ";\n")
        # disable Foreign Constraints at Load
        yield("PRAGMA foreign_keys = OFF; /*if SQlite */;")
        yield("\n/* SET foreign_key_checks = 0;/*if Mysql*/;")
        # how to parametrize Mysql to SQL92 standard
        yield("/* SET sql_mode = 'PIPES_AS_CONCAT';/*if Mysql*/;")
        yield("/* SET SQL_MODE = ANSI_QUOTES; /*if Mysql*/;\n")
        # now the standard dump (notice it uses BEGIN TRANSACTION)
        for line in self.conn.iterdump():
            yield(line)
        # re-instantiate Foreign_keys = True
        for row in self.conn.execute("PRAGMA foreign_keys"):
            flag = 'ON' if row[0] == 1 else 'OFF'
            yield("PRAGMA foreign_keys = %s;/*if SQlite*/;" % flag)
            yield("PRAGMA foreign_keys = %s;/*if SQlite bug*/;" % flag)
            yield("PRAGMA foreign_key_check;/*if SQLite, check*/;")
            yield("\n/*SET foreign_key_checks = %s;/*if Mysql*/;\n" % row[0])

    def execute(self, sql, env=None):
        """execute sql but intercept log"""
        if self.do_log:
            self.log.append(sql)
        return self.conn.execute(sql)

    def createpydef(self, sql):
        """generates and register a pydef instruction"""
        instruction = sql.strip('; \t\n\r')
        # create Python function in Python
        exec(instruction[2:], globals(), locals())
        # add Python function in SQLite
        firstline = (instruction[5:].splitlines()[0]).lstrip()
        firstline = firstline.replace(" ", "") + "("
        instr_name = firstline.split("(", 1)[0].strip()
        instr_parms = firstline.count(',')+1
        instr_add = (("self.conn.create_function('%s', %s, %s)" % (
                      instr_name, instr_parms, instr_name)))
        exec(instr_add, globals(), locals())
        # housekeeping definition of pydef in a dictionnary
        the_help = dict(globals(), **locals())[instr_name].__doc__
        self.conn_def[instr_name] = {
            'parameters': instr_parms, 'inst': instr_add,
            'help': the_help, 'pydef': instruction}
        return instr_name

    def get_tokens(self, sql, start=0, shell_tokens=False):
        """
        from given sql start position, yield tokens (value + token type)
        if shell_tokens is True, identify line shell_tokens as sqlite.exe does
        """
        length = len(sql)
        i = start
        can_be_shell_command = True
        dico = {' ': 'TK_SP', '\t': 'TK_SP', '\n': 'TK_SP', '\f': 'TK_SP',
                '\r': 'TK_SP', '(': 'TK_LP', ')': 'TK_RP', ';': 'TK_SEMI',
                ',': 'TK_COMMA', '/': 'TK_OTHER', "'": 'TK_STRING',
                "-": 'TK_OTHER', '"': 'TK_STRING', "`": 'TK_STRING'}
        while length > start:
            token = 'TK_OTHER'
            if shell_tokens and can_be_shell_command and i < length and (
               (sql[i] == "." and i == start) or
               (i > start and sql[i-1:i] == "\n.")):
                # a command line shell ! (supposed on one starting line)
                token = 'TK_SHELL'
                i = sql.find("\n", start)
                if i <= 0:
                    i = length
            elif sql[i] == "-" and i < length and sql[i:i+2] == "--":
                # this Token is an end-of-line comment : --blabla
                token = 'TK_COM'
                i = sql.find("\n", start)
                if i <= 0:
                    i = length
            elif sql[i] == "/" and i < length and sql[i:i+2] == "/*":
                # this Token is a comment block : /* and bla bla \n bla */
                token = 'TK_COM'
                i = sql.find("*/", start) + 2
                if i <= 1:
                    i = length
            elif sql[i] not in dico:
                # this token is a distinct word (tagged as 'TK_OTHER')
                while i < length and sql[i] not in dico:
                    i += 1
            else:
                # default token analyze case
                token = dico[sql[i]]
                if token == 'TK_SP':
                    # find the end of the 'Spaces' Token just detected
                    while (i < length and sql[i] in dico and
                            dico[sql[i]] == 'TK_SP'):
                                i += 1
                elif token == 'TK_STRING':
                    # find the end of the 'String' Token just detected
                    delimiter = sql[i]
                    if delimiter != "'":
                        token = 'TK_ID'  # usefull nuance ?
                    while(i < length):
                        i = sql.find(delimiter, i+1)
                        if i <= 0:  # String is never closed
                            i = length
                            token = 'TK_ERROR'
                        elif i < length - 1 and sql[i+1] == delimiter:
                            i += 1  # double '' case, so ignore and continue
                        else:
                            i += 1
                            break  # normal End of a  String
                else:
                    if i < length:
                        i += 1
            yield sql[start:i], token
            if token == 'TK_SEMI':  # a new sql order can be a new shell token
                can_be_shell_command = True
            elif token not in ('TK_COM', 'TK_SP'):  # can't be a shell token
                can_be_shell_command = False
            start = i

    def get_sqlsplit(self, sql, remove_comments=False):
        """yield a list of separated sql orders from a sql file"""
        trigger_mode = False
        mysql = [""]
        for tokv, token in self.get_tokens(sql, shell_tokens=True):
            # clear comments option
            if token != 'TK_COM' or not remove_comments:
                mysql.append(tokv)
            # special case for Trigger : semicolumn don't count
            if token == 'TK_OTHER':
                tok = tokv.upper()
                if tok == "TRIGGER":
                    trigger_mode = True
                    translvl = 0
                elif trigger_mode and tok in('BEGIN', 'CASE'):
                    translvl += 1
                elif trigger_mode and tok == 'END':
                    translvl -= 1
                    if translvl <= 0:
                        trigger_mode = False
            elif (token == 'TK_SEMI' and not trigger_mode):
                # end of a single sql
                yield "".join(mysql)
                mysql = []
            elif (token == 'TK_SHELL'):
                # end of a shell order
                yield("" + tokv)
                mysql = []
        if mysql != []:
            yield("".join(mysql))

    def insert_reader(self, reader, table_name, create_sql=None,
                      create_table=True, replace=True, header=False):
        """import a given csv reader into a given table"""
        curs = self.conn.cursor()
        # 1-do initialization job
        # speed-up dead otherwise dead slow speed if not memory database
        try:
            curs.execute('begin transaction')
        except:
            pass
        # check if table exists
        here = curs.execute('PRAGMA table_info("%s")' % table_name).fetchall()
        if create_sql and (create_table or len(here) == 0):
            curs.execute('drop TABLE if exists "%s";' % table_name)
            curs.execute(create_sql)
        if replace:
            curs.execute('delete from "%s";' % table_name)
        # count rows of target table
        nbcol = len(curs.execute('pragma table_info("%s")' % table_name
                   ).fetchall())
        sql = 'INSERT INTO "%s" VALUES(%s);' % (table_name,
                                                ", ".join(["?"]*nbcol))
        # read first_line if hasked to skip headers
        if header:
            next(reader)
        # 2-push records
        curs.executemany(sql, reader)
        self.conn.commit()

    def export_writer(self, sql, csv_file, header=True,
                      delimiter=',', encoding='utf-8', quotechar='"'):
        """export a csv table (action)"""
        cursor = self.conn.cursor()
        cursor.execute(sql)
        if sys.version_info[0] != 2:  # python3
            fout = io.open(csv_file, 'w', newline='', encoding=encoding)
            writer = csv.writer(fout, delimiter=delimiter,
                                quotechar='"', quoting=csv.QUOTE_MINIMAL)
        else:  # python2.7 (minimal)
            fout = io.open(csv_file, 'wb')
            writer = csv.writer(fout, delimiter=str(delimiter),
                                quotechar=str('"'), quoting=csv.QUOTE_MINIMAL)
        if header:
            writer.writerow([i[0] for i in cursor.description])  # heading row
        writer.writerows(cursor.fetchall())
        fout.close


def _main():
    app = App()
    # start with a memory Database and a welcome
    app.new_db(":memory:")
    welcome_text = """-- SQLite Memo (Demo = click on green "->" and "@" icons)
\n-- to CREATE a table 'items' and a table 'parts' :
DROP TABLE IF EXISTS item; DROP TABLE IF EXISTS part;
CREATE TABLE item (ItemNo, Description,Kg  , PRIMARY KEY (ItemNo));
CREATE TABLE part(ParentNo, ChildNo , Description TEXT , Qty_per REAL);
\n-- to CREATE an index :
DROP INDEX IF EXISTS parts_id1;
CREATE INDEX parts_id1 ON part(ParentNo Asc, ChildNo Desc);
\n-- to CREATE a view 'v1':
DROP VIEW IF EXISTS v1;
CREATE VIEW v1 as select * from item inner join part as p ON ItemNo=p.ParentNo;
\n-- to INSERT datas
INSERT INTO item values("T","Ford",1000);
INSERT INTO item select "A","Merced",1250 union all select "W","Wheel",9 ;
INSERT INTO part select ItemNo,"W","needed",Kg/250 from item where Kg>250;
\n-- to CREATE a Python embedded function (enclose them by "py" and ";") :
pydef py_sin(s):
    "sinus function : example loading module, handling input/output as strings"
    import math as py_math
    return ("%s" %  py_math.sin(s*1));
pydef py_fib(n):
   "fibonacci : example with function call (may only be internal) "
   fib = lambda n: n if n < 2 else fib(n-1) + fib(n-2)
   return("%s" % fib(n*1));
pydef py_power(x,y):
    "power function : example loading module, handling input/output as strings"
    import math as py_math
    return ("%s" %  ((x*1) ** (y*1)) );
\n-- to USE a python embedded function and nesting of embedded functions:
select py_sin(1) as sinus, py_power(2, 1*py_fib(6)) as power, sqlite_version();
\n-- to EXPORT :
--    a TABLE, select TABLE, then click on icon 'SQL->CSV'
--    a QUERY RESULT, select the SCRIPT text, then click on icon '???->CSV',
-- example : select the end of this line: SELECT SQLITE_VERSION()
\n\n-- to use COMMIT and ROLLBACK :
BEGIN TRANSACTION;
UPDATE item SET Kg = Kg + 1;
COMMIT;
BEGIN TRANSACTION;
UPDATE item SET Kg = 0;
select Kg, Description from Item;
ROLLBACK;
select Kg, Description from Item;
\n\n-- to use SAVEPOINT :
SAVEPOINT remember_Neo;  -- create a savepoint
UPDATE item SET Description = 'Smith'; -- do things
SELECT ItemNo, Description FROM Item; -- see things done
ROLLBACK TO SAVEPOINT remember_Neo; -- go back to savepoint state
SELECT ItemNo, Description FROM Item;  -- see all is back to normal
RELEASE SAVEPOINT remember_Neo; -- free memory
\n\n-- '.' commands understood:
-- .once FILENAME         Output for the next SQL command only to FILENAME
-- .import FILE TABLE     Import data from FILE into TABLE
-- (create table only if it doesn't exist, keep existing records)
.once 'this_file_of_result.txt'
select ItemNo, Description from item order by ItemNo desc;
.import 'this_file_of_result.txt' in_this_table

"""
    app.n.new_query_tab("Welcome", welcome_text)
    app.tk_win.mainloop()

if __name__ == '__main__':
    _main()    # create a tkk graphic interface with a main window tk_win
