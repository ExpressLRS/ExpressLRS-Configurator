# from pyappveyordemo.extension import some_function
from nose.tools import assert_equal

def test_DeBase():
    "learning the ropes"
    assert_equal(1 , 1)
	
def test_Basics():
    "create script, run script, output result, check result"
    import os
    import io
    from sqlite_bro import sqlite_bro
    app = sqlite_bro.App()
    app.new_db(":memory:")
    tmp_file = 'sqlite_bro_test_Basics.tmp'
    welcome_text = """
create table item (ItemNo, Description,Kg  , PRIMARY KEY (ItemNo));
INSERT INTO item values("T","Ford",1000);
INSERT INTO item select "A","Merced",1250 union all select "W","Wheel",9 ;
.once '%s'
select ItemNo, Description, 1000*Kg Gramm  from item order by ItemNo desc;
.import '%s' in_this_table""" % (tmp_file, tmp_file)
    app.n.new_query_tab("Welcome", welcome_text)
    app.run_tab()
    app.close_db
	
    file_encoding = sqlite_bro.guess_encoding(tmp_file)[0]
    with io.open(tmp_file, mode='rt', encoding=file_encoding) as f:
        result = f.readlines()
    assert_equal(len(result) , 4)
    assert_equal(result[-1] , "A,Merced,1250000\n")
    os.remove(tmp_file)