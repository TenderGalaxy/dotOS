import github
# from github import Github
import os
try:
  os.mkdir('build')
except:
  pass
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

# Fetch file contents
import quickjs
js = quickjs.Context()
def getList(v):
  js.eval(f'temp = {v}')
  return [js.eval(f'temp[{i}]') for i in range(js.eval('temp.length'))]
modules = ['src/modules/' + i for i in os.listdir('src/modules')]
world = []
block = {}
files = []
for filename in modules:
  print(f'Now loading {filename}')
  with open(filename) as rawfile:
    file = rawfile.read().strip()
    js.eval(file)
    type = js.eval('obj.info.type') # Either 'os' or 'worldcode'
    callbacks = getList('Object.keys(obj.callbacks)')
    if type == 'worldcode':
      if 'onLoad' in callbacks:
        func = js.eval('obj.callbacks.onLoad.toString()')
        world.append(f'{func[func.index('{')+1:-2]}')
        callbacks.remove('onLoad')
      for i in callbacks:
        func = js.eval(f'obj.callbacks.{i}.toString()')
        func = 'function' + func[func.index('('):]
        world.append(f'dotOS.callbacks.{i}.push({func})\n')
    elif type == 'os':
      code = ''
      if 'onLoad' in callbacks:
        func = js.eval('obj.callbacks.onLoad.toString()')
        code += (f'{func[func.index('{')+1:-2]}\n')
        callbacks.remove('onLoad')
      for i in callbacks:
        func = js.eval(f'obj.callbacks.{i}.toString()')
        func = 'function' + func[func.index('('):]
        code += (f'dotOS.callbacks.{i}.push(' + func +')\n')
      name = js.eval('obj.info.name')
      block[name] = [code, getList('obj.info.requirements')]
dir = [i for i in os.listdir('src/data/')]
for i in dir:
  with open('src/data/' + i) as f:
    name = i[:i.rfind('.')]
    extend = i[i.rfind('.')+1:]
    files += f'''toUpload.push({{
        name: \'{i}\',
        contents: JSON.stringify({f.read()})
      }})'''
with open('build/worldcode.js', 'w') as f:
  for i in world:
    f.write(i)
names = [key for key, value in block.items()]
replacements = [value[0] for key, value in block.items()]
requirements = {key: value[1] for key, value in block.items()}
names = orderArray(names[:], requirements)
print(f'Ordered in {names}')
with open('build/codeblock.js', 'w') as f:
  for i in range(len(names)):
    f.write(replacements[i])
with open('build/files.js', 'w') as f:
  f.write('toUpload = []\n')
  for i in files:
    f.write(i)