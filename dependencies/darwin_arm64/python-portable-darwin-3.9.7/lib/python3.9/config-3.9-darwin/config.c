/* Generated automatically from ./Modules/config.c.in by makesetup. */
/* -*- C -*- ***********************************************
Copyright (c) 2000, BeOpen.com.
Copyright (c) 1995-2000, Corporation for National Research Initiatives.
Copyright (c) 1990-1995, Stichting Mathematisch Centrum.
All rights reserved.

See the file "Misc/COPYRIGHT" for information on usage and
redistribution of this file, and for a DISCLAIMER OF ALL WARRANTIES.
******************************************************************/

/* Module configuration */

/* !!! !!! !!! This file is edited by the makesetup script !!! !!! !!! */

/* This file contains the table of built-in modules.
   See create_builtin() in import.c. */

#include "Python.h"

#ifdef __cplusplus
extern "C" {
#endif


extern PyObject* PyInit_array(void);
extern PyObject* PyInit_cmath(void);
extern PyObject* PyInit_math(void);
extern PyObject* PyInit__contextvars(void);
extern PyObject* PyInit__struct(void);
extern PyObject* PyInit__weakref(void);
extern PyObject* PyInit__testinternalcapi(void);
extern PyObject* PyInit__random(void);
extern PyObject* PyInit__pickle(void);
extern PyObject* PyInit__datetime(void);
extern PyObject* PyInit__zoneinfo(void);
extern PyObject* PyInit__bisect(void);
extern PyObject* PyInit__heapq(void);
extern PyObject* PyInit__asyncio(void);
extern PyObject* PyInit__statistics(void);
extern PyObject* PyInit_unicodedata(void);
extern PyObject* PyInit_fcntl(void);
extern PyObject* PyInit_grp(void);
extern PyObject* PyInit_select(void);
extern PyObject* PyInit_mmap(void);
extern PyObject* PyInit__csv(void);
extern PyObject* PyInit__socket(void);
extern PyObject* PyInit_termios(void);
extern PyObject* PyInit_resource(void);
extern PyObject* PyInit__posixsubprocess(void);
extern PyObject* PyInit_audioop(void);
extern PyObject* PyInit__md5(void);
extern PyObject* PyInit__sha1(void);
extern PyObject* PyInit__sha256(void);
extern PyObject* PyInit__sha512(void);
extern PyObject* PyInit__sha3(void);
extern PyObject* PyInit__blake2(void);
extern PyObject* PyInit_syslog(void);
extern PyObject* PyInit_binascii(void);
extern PyObject* PyInit_parser(void);
extern PyObject* PyInit_zlib(void);
extern PyObject* PyInit__multibytecodec(void);
extern PyObject* PyInit__codecs_cn(void);
extern PyObject* PyInit__codecs_hk(void);
extern PyObject* PyInit__codecs_iso2022(void);
extern PyObject* PyInit__codecs_jp(void);
extern PyObject* PyInit__codecs_kr(void);
extern PyObject* PyInit__codecs_tw(void);
extern PyObject* PyInit__bz2(void);
extern PyObject* PyInit__crypt(void);
extern PyObject* PyInit__curses(void);
extern PyObject* PyInit__curses_panel(void);
extern PyObject* PyInit__ctypes(void);
extern PyObject* PyInit__ctypes_test(void);
extern PyObject* PyInit__decimal(void);
extern PyObject* PyInit__dbm(void);
extern PyObject* PyInit__elementtree(void);
extern PyObject* PyInit__hashlib(void);
extern PyObject* PyInit__json(void);
extern PyObject* PyInit__lsprof(void);
extern PyObject* PyInit__lzma(void);
extern PyObject* PyInit__multiprocessing(void);
extern PyObject* PyInit__opcode(void);
extern PyObject* PyInit__posixshmem(void);
extern PyObject* PyInit__queue(void);
extern PyObject* PyInit__scproxy(void);
extern PyObject* PyInit__sqlite3(void);
extern PyObject* PyInit__ssl(void);
extern PyObject* PyInit__testbuffer(void);
extern PyObject* PyInit__testimportmultiple(void);
extern PyObject* PyInit__testinternalcapi(void);
extern PyObject* PyInit__testmultiphase(void);
extern PyObject* PyInit__tkinter(void);
extern PyObject* PyInit__uuid(void);
extern PyObject* PyInit__xxsubinterpreters(void);
extern PyObject* PyInit__xxtestfuzz(void);
extern PyObject* PyInit_pyexpat(void);
extern PyObject* PyInit_readline(void);
extern PyObject* PyInit_posix(void);
extern PyObject* PyInit_errno(void);
extern PyObject* PyInit_pwd(void);
extern PyObject* PyInit__sre(void);
extern PyObject* PyInit__codecs(void);
extern PyObject* PyInit__weakref(void);
extern PyObject* PyInit__functools(void);
extern PyObject* PyInit__operator(void);
extern PyObject* PyInit__collections(void);
extern PyObject* PyInit__abc(void);
extern PyObject* PyInit_itertools(void);
extern PyObject* PyInit_atexit(void);
extern PyObject* PyInit__signal(void);
extern PyObject* PyInit__stat(void);
extern PyObject* PyInit_time(void);
extern PyObject* PyInit__thread(void);
extern PyObject* PyInit__locale(void);
extern PyObject* PyInit__io(void);
extern PyObject* PyInit_faulthandler(void);
extern PyObject* PyInit__tracemalloc(void);
extern PyObject* PyInit__peg_parser(void);
extern PyObject* PyInit__symtable(void);
extern PyObject* PyInit_xxsubtype(void);

/* -- ADDMODULE MARKER 1 -- */

extern PyObject* PyMarshal_Init(void);
extern PyObject* PyInit__imp(void);
extern PyObject* PyInit_gc(void);
extern PyObject* PyInit__ast(void);
extern PyObject* _PyWarnings_Init(void);
extern PyObject* PyInit__string(void);

struct _inittab _PyImport_Inittab[] = {

    {"array", PyInit_array},
    {"cmath", PyInit_cmath},
    {"math", PyInit_math},
    {"_contextvars", PyInit__contextvars},
    {"_struct", PyInit__struct},
    {"_weakref", PyInit__weakref},
    {"_testinternalcapi", PyInit__testinternalcapi},
    {"_random", PyInit__random},
    {"_pickle", PyInit__pickle},
    {"_datetime", PyInit__datetime},
    {"_zoneinfo", PyInit__zoneinfo},
    {"_bisect", PyInit__bisect},
    {"_heapq", PyInit__heapq},
    {"_asyncio", PyInit__asyncio},
    {"_statistics", PyInit__statistics},
    {"unicodedata", PyInit_unicodedata},
    {"fcntl", PyInit_fcntl},
    {"grp", PyInit_grp},
    {"select", PyInit_select},
    {"mmap", PyInit_mmap},
    {"_csv", PyInit__csv},
    {"_socket", PyInit__socket},
    {"termios", PyInit_termios},
    {"resource", PyInit_resource},
    {"_posixsubprocess", PyInit__posixsubprocess},
    {"audioop", PyInit_audioop},
    {"_md5", PyInit__md5},
    {"_sha1", PyInit__sha1},
    {"_sha256", PyInit__sha256},
    {"_sha512", PyInit__sha512},
    {"_sha3", PyInit__sha3},
    {"_blake2", PyInit__blake2},
    {"syslog", PyInit_syslog},
    {"binascii", PyInit_binascii},
    {"parser", PyInit_parser},
    {"zlib", PyInit_zlib},
    {"_multibytecodec", PyInit__multibytecodec},
    {"_codecs_cn", PyInit__codecs_cn},
    {"_codecs_hk", PyInit__codecs_hk},
    {"_codecs_iso2022", PyInit__codecs_iso2022},
    {"_codecs_jp", PyInit__codecs_jp},
    {"_codecs_kr", PyInit__codecs_kr},
    {"_codecs_tw", PyInit__codecs_tw},
    {"_bz2", PyInit__bz2},
    {"_crypt", PyInit__crypt},
    {"_curses", PyInit__curses},
    {"_curses_panel", PyInit__curses_panel},
    {"_ctypes", PyInit__ctypes},
    {"_ctypes_test", PyInit__ctypes_test},
    {"_decimal", PyInit__decimal},
    {"_dbm", PyInit__dbm},
    {"_elementtree", PyInit__elementtree},
    {"_hashlib", PyInit__hashlib},
    {"_json", PyInit__json},
    {"_lsprof", PyInit__lsprof},
    {"_lzma", PyInit__lzma},
    {"_multiprocessing", PyInit__multiprocessing},
    {"_opcode", PyInit__opcode},
    {"_posixshmem", PyInit__posixshmem},
    {"_queue", PyInit__queue},
    {"_scproxy", PyInit__scproxy},
    {"_sqlite3", PyInit__sqlite3},
    {"_ssl", PyInit__ssl},
    {"_testbuffer", PyInit__testbuffer},
    {"_testimportmultiple", PyInit__testimportmultiple},
    {"_testinternalcapi", PyInit__testinternalcapi},
    {"_testmultiphase", PyInit__testmultiphase},
    {"_tkinter", PyInit__tkinter},
    {"_uuid", PyInit__uuid},
    {"_xxsubinterpreters", PyInit__xxsubinterpreters},
    {"_xxtestfuzz", PyInit__xxtestfuzz},
    {"pyexpat", PyInit_pyexpat},
    {"readline", PyInit_readline},
    {"posix", PyInit_posix},
    {"errno", PyInit_errno},
    {"pwd", PyInit_pwd},
    {"_sre", PyInit__sre},
    {"_codecs", PyInit__codecs},
    {"_weakref", PyInit__weakref},
    {"_functools", PyInit__functools},
    {"_operator", PyInit__operator},
    {"_collections", PyInit__collections},
    {"_abc", PyInit__abc},
    {"itertools", PyInit_itertools},
    {"atexit", PyInit_atexit},
    {"_signal", PyInit__signal},
    {"_stat", PyInit__stat},
    {"time", PyInit_time},
    {"_thread", PyInit__thread},
    {"_locale", PyInit__locale},
    {"_io", PyInit__io},
    {"faulthandler", PyInit_faulthandler},
    {"_tracemalloc", PyInit__tracemalloc},
    {"_peg_parser", PyInit__peg_parser},
    {"_symtable", PyInit__symtable},
    {"xxsubtype", PyInit_xxsubtype},

/* -- ADDMODULE MARKER 2 -- */

    /* This module lives in marshal.c */
    {"marshal", PyMarshal_Init},

    /* This lives in import.c */
    {"_imp", PyInit__imp},

    /* This lives in Python/Python-ast.c */
    {"_ast", PyInit__ast},

    /* These entries are here for sys.builtin_module_names */
    {"builtins", NULL},
    {"sys", NULL},

    /* This lives in gcmodule.c */
    {"gc", PyInit_gc},

    /* This lives in _warnings.c */
    {"_warnings", _PyWarnings_Init},

    /* This lives in Objects/unicodeobject.c */
    {"_string", PyInit__string},

    /* Sentinel */
    {0, 0}
};


#ifdef __cplusplus
}
#endif
