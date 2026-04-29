<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $student->first_name }} {{ $student->last_name }} - Portfolio</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            background-color: #ffffff;
            color: #1f2937;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #111827;
            margin-top: 0;
        }
        .text-orange { color: #f97316; }
        .bg-orange { background-color: #f97316; color: #fff; }
        .page-break { page-break-after: always; }
        
        /* ── Header / Cover ── */
        .cover { text-align: center; margin-top: 4cm; margin-bottom: 2cm; }
        .cover h1 { font-size: 32pt; margin-bottom: 0.2cm; font-weight: bold; }
        .cover h2 { font-size: 16pt; color: #4b5563; font-weight: normal; margin-bottom: 1cm; }
        .cover .uni-name { font-size: 14pt; color: #f97316; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 10pt; text-transform: uppercase; border: 1px solid #e5e7eb; }
        .badge.regular { background-color: #ecfdf5; color: #059669; border-color: #6ee7b7; }
        
        /* ── Sections ── */
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #111827;
            border-left: 4px solid #f97316;
            padding-left: 8px;
            margin-top: 1cm;
            margin-bottom: 0.5cm;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* ── Tables ── */
        table { width: 100%; border-collapse: collapse; margin-bottom: 0.5cm; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background-color: #f9fafb; font-weight: bold; color: #374151; font-size: 9pt; text-transform: uppercase; }
        
        /* ── Big Stats ── */
        .stat-box { border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; display: inline-block; min-width: 120px; text-align: center; margin-right: 12px; margin-bottom: 12px; }
        .stat-val { font-size: 24pt; font-weight: bold; color: #f97316; line-height: 1; margin-bottom: 4px; }
        .stat-lbl { font-size: 8pt; color: #6b7280; text-transform: uppercase; font-weight: bold; }
        
        /* ── Skills Pills ── */
        .skill-pill { display: inline-block; border: 1px solid #f97316; color: #f97316; padding: 4px 10px; border-radius: 12px; margin-right: 6px; margin-bottom: 6px; font-size: 9pt; font-weight: bold; }
        
        /* ── Notes ── */
        .note-box { background-color: #fffbeb; border: 1px solid #fcd34d; padding: 12px; border-radius: 4px; color: #b45309; }
    </style>
</head>
<body>

    <!-- PAGE 1: Cover Header -->
    <div class="cover">
        <div class="uni-name">College of Computing Studies</div>
        <div style="margin-top: 2cm;">
            <h1>{{ $student->first_name }} {{ $student->last_name }}</h1>
            <h2>{{ $student->course }} — {{ $student->year_level }} Year ({{ $student->section->name ?? 'No Section' }})</h2>
        </div>
        
        <div style="margin-top: 1cm;">
            <p><strong>Student ID:</strong> <span style="font-family: monospace; font-size: 12pt;">{{ $student->student_id }}</span></p>
            <p><strong>Major:</strong> {{ $student->major ?? 'N/A' }}</p>
            <div style="margin-top: 20px;">
                <span class="badge {{ strtolower($student->academic_status) }}">{{ strtoupper($student->academic_status) }}</span>
                @if($student->latin_honors)
                    <span class="badge" style="background: #fffbeb; color: #d97706; border-color: #fcd34d;">🏅 {{ strtoupper($student->latin_honors) }}</span>
                @endif
            </div>
        </div>
        
        <div style="margin-top: 4cm; color: #9ca3af; font-size: 9pt; text-transform: uppercase;">
            Generated on {{ date('F d, Y') }}
        </div>
    </div>
    
    <div class="page-break"></div>

    <!-- PAGE 2: Academic Profile -->
    <div class="section-title">Academic Profile</div>
    
    <div>
        <div class="stat-box">
            <div class="stat-val">{{ $overallGwa }}</div>
            <div class="stat-lbl">Overall GWA</div>
        </div>
        <div class="stat-box">
            <div class="stat-val">{{ $deanListCount }}</div>
            <div class="stat-lbl">Dean's List Semesters</div>
        </div>
    </div>

    <h3 style="margin-top: 0.8cm; color: #4b5563;">Semester Breakdown</h3>
    @if($student->semesterRecords && $student->semesterRecords->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Academic Year</th>
                    <th>Semester</th>
                    <th>GWA</th>
                    <th>Subj Passed</th>
                    <th>Subj Failed</th>
                </tr>
            </thead>
            <tbody>
                @foreach($student->semesterRecords as $record)
                    @php
                        $passed = $record->subjects->where('status', 'passed')->count();
                        $failed = $record->subjects->where('status', 'failed')->count();
                    @endphp
                <tr>
                    <td>{{ $record->academic_year }}</td>
                    <td>{{ $record->semester }}</td>
                    <td><strong>{{ $record->computed_gwa }}</strong></td>
                    <td style="color: #059669;">{{ $passed }}</td>
                    <td style="color: #dc2626;">{{ $failed }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No semester records found.</p>
    @endif

    @if($alerts && $alerts->count() > 0)
        <div class="note-box" style="margin-top: 1cm;">
            <strong>Advisory Notes:</strong>
            <ul style="margin: 0; padding-left: 20px;">
                @foreach($alerts as $alert)
                    <li>[{{ $alert['type'] ?? 'Alert' }}]: {{ $alert['message'] ?? 'N/A' }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="page-break"></div>

    <!-- PAGE 3: Extracurricular Activities -->
    <div class="section-title">Extracurricular Record</div>
    
    <div style="margin-bottom: 0.5cm;">
        <div class="stat-box" style="border-color: #f97316; background: #fffaf5;">
            <div class="stat-val">{{ $ranking->total_points ?? 0 }}</div>
            <div class="stat-lbl text-orange">Activity Points</div>
        </div>
        @if($ranking && $ranking->rank)
        <div class="stat-box">
            <div class="stat-val">#{{ $ranking->rank }}</div>
            <div class="stat-lbl">Global Rank</div>
        </div>
        @endif
        @if($ranking && $ranking->topCategory)
        <div class="stat-box">
            <div class="stat-val" style="font-size: 14pt; margin-top: 8px;">{{ $ranking->topCategory->name }}</div>
            <div class="stat-lbl">Top Category</div>
        </div>
        @endif
    </div>

    @forelse($activitiesByCategory as $category => $activities)
        <h4 style="color: #4b5563; margin-top: 0.8cm; text-transform: uppercase;">{{ $category }}</h4>
        <table>
            <thead>
                <tr>
                    <th>Activity Name</th>
                    <th>Role</th>
                    <th>Academic Year</th>
                    <th>Achievement</th>
                </tr>
            </thead>
            <tbody>
                @foreach($activities as $sa)
                <tr>
                    <td><strong>{{ $sa->activity->name ?? 'Unknown' }}</strong></td>
                    <td style="text-transform: capitalize;">{{ $sa->role }}</td>
                    <td>{{ $sa->academic_year }}</td>
                    <td>{{ $sa->achievement ?: '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @empty
        <p>No extracurricular activities recorded.</p>
    @endforelse

    <div class="page-break"></div>

    <!-- PAGE 4: Skills & Competencies -->
    <div class="section-title">Skills & Competencies</div>
    
    @forelse($skillsByProficiency as $proficiency => $skills)
        <div style="margin-bottom: 0.8cm;">
            <h4 style="text-transform: uppercase; color: #6b7280; font-size: 9pt; letter-spacing: 1px;">{{ ucfirst($proficiency) }} Proficiency</h4>
            <div style="margin-top: 8px;">
                @foreach($skills as $skill)
                    <span class="skill-pill">{{ $skill->skill }}</span>
                @endforeach
            </div>
        </div>
    @empty
        <p>No professional skills logged.</p>
    @endforelse

    
    <!-- PAGE 5: Capstone / Thesis -->
    @if($student->capstoneProjects && $student->capstoneProjects->count() > 0)
        <div class="section-title" style="margin-top: 1.5cm;">Capstone / Thesis</div>
        @foreach($student->capstoneProjects as $cp)
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <h3 style="margin-bottom: 4px; color: #111827;">{{ $cp->title }}</h3>
            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 9pt;">Role: {{ ucfirst($cp->role) }} | Status: {{ ucfirst($cp->status) }}</p>
            
            <table style="margin-bottom: 0;">
                <tr>
                    <td style="width: 30%; background: #f9fafb; font-weight: bold;">Adviser</td>
                    <td>{{ $cp->adviser_name ?: 'TBA' }}</td>
                </tr>
                <tr>
                    <td style="background: #f9fafb; font-weight: bold;">Group Members</td>
                    <td>{{ $cp->group_members ?: 'N/A' }}</td>
                </tr>
                <tr>
                    <td style="background: #f9fafb; font-weight: bold;">Grade</td>
                    <td><strong>{{ $cp->grade ?: 'In Progress' }}</strong></td>
                </tr>
            </table>
        </div>
        @endforeach
    @endif

</body>
</html>
