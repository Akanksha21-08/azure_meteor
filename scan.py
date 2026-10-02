import os
import re

print("Starting scan for potential JSX / JS issues...")

backtick = chr(96)

for root, dirs, files in os.walk('client/src'):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            for idx, line in enumerate(lines, 1):
                # 1. Check for className={something} without quotes or backticks
                matches = re.findall(r'className=\{([^"\'`{}]+)\}', line)
                for m in matches:
                    m_clean = m.strip()
                    if '-' in m_clean or ' ' in m_clean:
                        print(f"[Corrupted className] {path}:{idx} -> {line.strip()}")
                
                # 2. Check for ${ inside JSX or strings without backticks on that line
                # Note: multiline template literals might exist, so check with care
                if '${' in line and backtick not in line:
                    print(f"[Possible missing backtick] {path}:{idx} -> {line.strip()}")

                # 3. Check for to={ or href={ without quotes or backtick
                matches_to = re.findall(r'(to|href)=\{([^"\'`{}]+)\}', line)
                for prop, m in matches_to:
                    m_clean = m.strip()
                    # if it has slashes or hyphens it was meant to be a string
                    if '/' in m_clean or '-' in m_clean:
                        print(f"[Corrupted {prop}] {path}:{idx} -> {line.strip()}")

print("Scan finished.")