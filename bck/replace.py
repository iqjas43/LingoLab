import os
import glob

directory = r'd:\PROJECT\bck\fnt\client\src'
count = 0
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'http://localhost:3000' in content or 'http://localhost:5000' in content:
                content = content.replace('http://localhost:3000', 'http://localhost:3000')
                content = content.replace('http://localhost:5000', 'http://localhost:3000')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
                count += 1

print(f"Total updated: {count}")
