import github
from github import Github
import os

def orderArray(arr, req):
  output = []
  while len(arr) > 0:
    pr = len(arr)
    for i in arr:
      if all([j in output for j in req[i]]):
        arr.remove(i)
        output.append(i)
    if len(arr) == pr:
      print('There\'s a circular dependency within this list of libraries!')
      print(arr)
      print('Requirements:')
      print(req)
      raise ValueError('This array is circular!')
  return output
def pullGithub(repoName):
  g = Github(auth=github.Auth.Token('GITHUB_PAT_TOKEN')) # FILL WITH YOUR PAT TOKEN
  repo = g.get_repo(repoName)
  os.makedirs(repoName, exist_ok = True)
  pullGithub_pull(repo, 'src')
def pullGithub_pull(repo, path):
  os.makedirs(path, exist_ok = True)
  f = pullGithub_convDir(repo.get_contents(path))
  for i in f:
    print(i)
    if not '.' in i:
      pullGithub_pull(repo, i)
    else:
      t = open(i, 'w')
      t.write(repo.get_contents(i).decoded_content.decode('utf-8'))
      t.close()
def pullGithub_getFname(x):
  x = str(x)
  return x[x.index('"')+1:-2]
def pullGithub_convDir(x):
  return [pullGithub_getFname(i) for i in x]
pullGithub('tendergalaxy/dotOS')

# Combine

import quickjs
import os
import json
js = quickjs.Context()

def getList(v):
  js.eval(f'temp = {v}')
  return [js.eval(f'temp[{i}]') for i in range(js.eval('temp.length'))]
def trimTabs(t, m):
  t = t[7:-1].split('\n')
  for i in range(2, len(t)):
    t[i] = t[i][2*m:]
  return '\n'.join(t)
dir = ['src/modules/' + i for i in os.listdir('src/modules')]
dir = [i for i in dir if i[-3:] == '.js']
worldcode = open('build/worldcode.js', 'w')
codeblock = open('build/codeblock.js', 'w')
_ = '''/*
DotOS
  - written by fenl_, 2026
(GPL V3 License)
I did not write this code myself, I wrote a script in python
to compile modules into separate code blocks and world code.

*/
'''
worldcode.write(_)
worldcode.write('dotOS = {}\n')
codeblock.write(_)
codeblock.write('''FS.setFile('System', '[]')
FS.newFile('System', 'Data', '[]')
FS.newFile('System', 'Modules', '[]')\n''')
wcCallbacks = []
cbName = []
cbCode = []
requirements = {}
print(dir)
for fileName in dir:
  with open(fileName) as file:
    f = file.read().strip()
    '''f = f.replace('"', '\\"')
    f = f.replace("'", "\\'")
    f = f.replace('`', '\\`')'''
    obj = js.eval(f"obj = {f}; obj")
    objtype = js.eval('obj.info.type')
    js.eval('callbackNames = Object.keys(obj.callbacks)')
    req = getList('obj.info.requirements')
    callbacks = [js.eval('callbackNames[' + str(i) + ']') for i in range(js.eval('callbackNames.length'))]
    print(f'''
    Loading package {js.eval('obj.info.name')}
      type: {objtype}
      version: {js.eval('obj.info.version')}
      source: {js.eval('obj.info.source')}
      requirements: {req}
    with the following callbacks:
      {', '.join(callbacks)}
    ''')
    if objtype == 'worldcode':
      if 'onLoad' in callbacks:
        t = js.eval('obj.callbacks.onLoad.toString()')
        worldcode.write(f'{t[t.index('{')+1:-2]}\n')
        callbacks.remove('onLoad')
      for i in callbacks:
        callf = js.eval(f'obj.callbacks.{i}.toString()')
        callf = 'function' + callf[callf.index('('):]
        wcCallbacks.append(f'dotOS.callbacks.{i}.push(' + callf +')\n')
    elif objtype == 'os':
      t = ''
      if 'onLoad' in callbacks:
        m = js.eval('obj.callbacks.onLoad.toString()')
        t += (f'{m[m.index('{')+1:-2]}\n')
        callbacks.remove('onLoad')
      for i in callbacks:
        callf = js.eval(f'obj.callbacks.{i}.toString()')
        callf = 'function' + callf[callf.index('('):]
        t += (f'dotOS.callbacks.{i}.push(' + callf +')\n')
      n = js.eval('obj.info.name')
      cbName.append(n)
      cbCode.append(t)
      requirements[n] = req
dir = [i for i in os.listdir('src/data/')]
for i in dir:
  with open('src/data/' + i) as f:
    name = i[:i.rfind('.')]
    extend = i[i.rfind('.')+1:]
    codeblock.write(f'''FS.newFile('System/Data', '{i}', JSON.stringify({f.read()}))
    // Initializes file {i}''')
for i in wcCallbacks:
  worldcode.write(i)
t = orderArray(cbName[:], requirements)
print(f'Ordered in {t}')
for i in range(len(t)):
  codeblock.write(cbCode[cbName.index(t[i])])
worldcode.write('callbacks = null\n')
worldcode.close()
codeblock.close()
