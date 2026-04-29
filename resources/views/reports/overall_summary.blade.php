<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Overall Institutional Report</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.4; margin: 0; padding: 20px; background: #fff; }
        .header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 15px; margin-bottom: 25px; }
        .logo { font-size: 26px; font-weight: 800; color: #f97316; letter-spacing: -0.5px; }
        .subtitle { font-size: 13px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .report-title { font-size: 18px; font-weight: 900; margin: 20px 0; text-transform: uppercase; text-align: center; color: #111; border: 1px solid #eee; padding: 10px; background: #fcfcfc; }
        
        .stats-grid { width: 100%; border-collapse: separate; border-spacing: 10px; margin-bottom: 20px; }
        .stats-card { background: #fff; border: 1px solid #e5e7eb; padding: 15px; text-align: center; border-radius: 12px; }
        .stats-value { font-size: 22px; font-weight: 800; color: #f97316; }
        .stats-label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; font-weight: 700; }
        
        .section-title { font-size: 14px; font-weight: 800; border-left: 4px solid #f97316; padding-left: 12px; margin: 25px 0 15px; color: #111; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .grid-2 { width: 100%; }
        .grid-2 td { vertical-align: top; width: 50%; padding: 0 10px; }

        table.data-table { width: 100%; border-collapse: collapse; margin-top: 5px; border-radius: 8px; overflow: hidden; border: 1px solid #eee; }
        table.data-table th { background: #f8fafc; color: #475569; font-size: 10px; text-transform: uppercase; padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        table.data-table td { padding: 10px; font-size: 11px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        
        .badge { padding: 3px 8px; borderRadius: 12px; fontSize: 9px; fontWeight: 700; textTransform: uppercase; }
        .badge-orange { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; }
        .badge-green { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
        .badge-red { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }

        .progress-bg { background: #f1f5f9; height: 6px; border-radius: 3px; margin-top: 5px; overflow: hidden; }
        .progress-fill { background: #f97316; height: 100%; }

        .footer { position: fixed; bottom: 15px; width: 100%; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px; }
        .signature-section { margin-top: 40px; width: 100%; }
        .signature-box { width: 220px; }
        .sig-line { border-top: 1.5px solid #111; margin-bottom: 5px; margin-top: 35px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">College of Computing Studies</div>
        <div class="subtitle">Pamantasan ng Cabuyao · Institutional Analytics Engine</div>
    </div>

    <div class="report-title">Comprehensive Institutional Audit Summary</div>
    
    <table class="stats-grid">
        <tr>
            <td class="stats-card">
                <div class="stats-value">{{ $totalStudents }}</div>
                <div class="stats-label">Total Population</div>
            </td>
            <td class="stats-card">
                <div class="stats-value">{{ $avgGwa }}</div>
                <div class="stats-label">Avg. GWA</div>
            </td>
            <td class="stats-card">
                <div class="stats-value">{{ $clearanceRate }}%</div>
                <div class="stats-label">Clearance Rate</div>
            </td>
            <td class="stats-card">
                <div class="stats-value">{{ $totalAwards }}</div>
                <div class="stats-label">Total Achievements</div>
            </td>
        </tr>
    </table>

    <table class="grid-2">
        <tr>
            <td>
                <div class="section-title">Academic & Enrollment Distribution</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Year Level</th>
                            <th>Count</th>
                            <th>Institutional Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($yearDistribution as $year => $count)
                        <tr>
                            <td><strong>Year {{ $year }}</strong></td>
                            <td>{{ $count }} Students</td>
                            <td>
                                <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">{{ round(($count / $totalStudents) * 100, 1) }}%</div>
                                <div class="progress-bg"><div class="progress-fill" style="width: {{ ($count / $totalStudents) * 100 }}%"></div></div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </td>
            <td>
                <div class="section-title">Behavior & Conduct Audit</div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Violation Severity Matrix</div>
                        <div style="font-size: 18px; font-weight: 800; color: #ef4444; margin: 5px 0;">{{ $criticalViolations }} Critical Incidents</div>
                        <div style="font-size: 11px; color: #475569;">Out of {{ $totalViolations }} total behavior logs recorded this period.</div>
                    </div>
                    
                    <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Health & Attendance Activity</div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
                        <span>Total Health Screenings:</span>
                        <strong style="color: #111;">{{ $totalHealth }}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span>Cumulative Attendance Logs:</span>
                        <strong style="color: #111;">{{ $totalAttendance }}</strong>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">Institutional Engagement Leaderboard (Top 5)</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">Rank</th>
                <th>Student Name</th>
                <th>Year & Section</th>
                <th>Engagement Score</th>
                <th>Clearance Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($leaderboard as $index => $student)
            <tr>
                <td style="text-align: center; font-weight: 800; color: #f97316;">#{{ $index + 1 }}</td>
                <td><strong>{{ $student->first_name }} {{ $student->last_name }}</strong><br><small style="color: #94a3b8;">{{ $student->student_id }}</small></td>
                <td>{{ $student->year_level }} - {{ $student->section->name ?? 'N/A' }}</td>
                <td style="font-weight: 800; font-size: 13px;">{{ $student->engagement_score }}</td>
                <td>
                    @if($student->clearance && $student->clearance->status === 'cleared')
                        <span style="color: #16a34a; font-weight: 700;">● CLEARED</span>
                    @else
                        <span style="color: #dc2626; font-weight: 700;">○ PENDING</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="signature-section">
        <table style="width: 100%;">
            <tr>
                <td class="signature-box">
                    <div style="font-size: 10px; color: #64748b;">Prepared by:</div>
                    <div class="sig-line"></div>
                    <div style="font-size: 12px; font-weight: 800;">System Generated Report</div>
                    <div style="font-size: 9px; color: #64748b;">ProFile Analytics Engine</div>
                </td>
                <td style="width: 100px;"></td>
                <td class="signature-box">
                    <div style="font-size: 10px; color: #64748b;">Certified by:</div>
                    <div class="sig-line"></div>
                    <div style="font-size: 12px; font-weight: 800;">{{ $dean_name }}</div>
                    <div style="font-size: 9px; color: #64748b;">College Dean, CCS</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Confidential Document · {{ $institution }} · {{ $generated_at }} · Page 1 of 1
    </div>
</body>
</html>
