import os

for root, dirs, files in os.walk('client/src'):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            for idx, line in enumerate(lines, 1):
                if 'to={' in line or 'title={' in line:
                    if '' not in line and '"' not in line and "'" not in line:
                        print(f'{path}:{idx} -> {line.strip()}')