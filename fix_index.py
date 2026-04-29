import os

file_path = r'E:\Comprehensive_system 419\Comprehensive-system\resources\js\Pages\Grades\Index.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
found = False
for i, line in enumerate(lines):
    if 'College of Business Admin' in line and i < 2800:
        new_lines.append(line)
        # We need to check if the next line is the broken one
        if i + 1 < len(lines) and 'Grade Encoding Modal' in lines[i+1]:
            new_lines.append('                                </select>\n')
            new_lines.append('                            </div>\n')
            new_lines.append('\n')
            new_lines.append('                            <button type="submit" className="w-full h-16 rounded-[24px] bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-xl shadow-orange-500/20 border border-orange-400/50">\n')
            new_lines.append('                                Establish Program\n')
            new_lines.append('                            </button>\n')
            new_lines.append('                        </form>\n')
            new_lines.append('                    </div>\n')
            new_lines.append('                </div>\n')
            new_lines.append('            )}\n')
            new_lines.append('\n')
            new_lines.append('            {/* ── Grade Encoding Modal ── */}\n')
            found = True
            continue
    if found and 'Grade Encoding Modal' in line:
        # We already added the comment and the closing tags, skip the original broken comment
        continue
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fix applied successfully")
