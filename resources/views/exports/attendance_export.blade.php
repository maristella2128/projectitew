<!DOCTYPE html>
<html>
<head>
    <style>
        .header-title { text-align: center; font-size: 24pt; font-weight: bold; color: #f97316; margin-bottom: 5px; }
        .header-info { text-align: center; font-size: 11pt; color: #4b5563; margin-bottom: 25px; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
        
        table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; }
        th { background-color: #f97316; color: #ffffff; font-weight: bold; padding: 10px 5px; border: 1px solid #c2410c; text-align: center; }
        
        .day-num { font-size: 10pt; background-color: #ea580c; color: #ffffff; }
        .day-name { font-size: 8pt; background-color: #fb923c; color: #ffffff; font-weight: normal; }
        
        .today-header { background-color: #9a3412 !important; color: #ffffff !important; }
        .today-col { background-color: #fff7ed; border-left: 2px solid #f97316; border-right: 2px solid #f97316; }
        
        td { padding: 8px; border: 1px solid #e5e7eb; text-align: center; color: #374151; }
        .student-name { text-align: left; font-weight: bold; background-color: #fffafa; color: #111827; padding-left: 12px; }
        
        .status-p { color: #059669; font-weight: bold; }
        .status-a { color: #dc2626; font-weight: bold; }
        .status-l { color: #d97706; font-weight: bold; }
        .status-e { color: #2563eb; font-weight: bold; }
        
        .summary-header { background-color: #374151; color: #ffffff; font-size: 10pt; }
        .stats-val { background-color: #f9fafb; font-weight: bold; }
        .zebra { background-color: #fafafa; }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th colspan="{{ count($days) + 6 }}" style="background-color: white; color: #f97316; border: none; font-size: 26pt; padding-top: 20px;">
                    {{ strtoupper(\Carbon\Carbon::parse($month)->format('F Y')) }}
                </th>
            </tr>
            <tr>
                <th colspan="{{ count($days) + 6 }}" style="background-color: white; color: #6b7280; border: none; font-size: 12pt; padding-bottom: 20px;">
                    SECTION: {{ $section->name }} | PROGRAM: {{ $section->program->code ?? 'N/A' }} | Attendance Registry Summary
                </th>
            </tr>
            <tr>
                <th rowspan="2" style="width: 40px;">#</th>
                <th rowspan="2" style="width: 250px;">Student Identity</th>
                @foreach($days as $day)
                    @php 
                        $curr = \Carbon\Carbon::parse($month . '-' . str_pad($day, 2, '0', STR_PAD_LEFT));
                        $isToday = $curr->isToday();
                    @endphp
                    <th class="day-num {{ $isToday ? 'today-header' : '' }}">{{ $day }}</th>
                @endforeach
                <th colspan="4" class="summary-header">Monthly Summary</th>
            </tr>
            <tr>
                @foreach($days as $day)
                    @php 
                        $curr = \Carbon\Carbon::parse($month . '-' . $day);
                        $isToday = $curr->isToday();
                        $dow = $curr->format('D');
                        $isWeekend = in_array($dow, ['Sat', 'Sun']);
                    @endphp
                    <th class="day-name {{ $isToday ? 'today-header' : '' }}" style="{{ $isWeekend ? 'background-color: #fdba74;' : '' }}">
                        {{ strtoupper(substr($dow, 0, 2)) }}
                    </th>
                @endforeach
                <th class="summary-header" style="width: 35px;">P</th>
                <th class="summary-header" style="width: 35px;">A</th>
                <th class="summary-header" style="width: 35px;">L</th>
                <th class="summary-header" style="width: 35px;">E</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $student)
                @php $stats = $summaries[$student->id]; @endphp
                <tr class="{{ $index % 2 === 0 ? '' : 'zebra' }}">
                    <td style="color: #9ca3af;">{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</td>
                    <td class="student-name">{{ strtoupper($student->last_name) }}, {{ $student->first_name }}</td>
                    
                    @foreach($days as $day)
                        @php
                            $dateObj = \Carbon\Carbon::parse($month . '-' . str_pad($day, 2, '0', STR_PAD_LEFT));
                            $dateStr = $dateObj->format('Y-m-d');
                            $status = $attendanceData[$student->id][$dateStr] ?? null;
                            $isFuture = $dateObj->isAfter($today);
                            $isToday = $dateObj->isToday();
                        @endphp
                        
                        <td class="{{ $isToday ? 'today-col' : '' }}">
                            @if($isFuture && !$status)
                                <!-- Empty for future with no data -->
                            @elseif($status)
                                <span class="status-{{ substr($status, 0, 1) }}">
                                    {{ strtoupper(substr($status, 0, 1)) }}
                                </span>
                            @else
                                <span style="color: #e5e7eb;">-</span>
                            @endif
                        </td>
                    @endforeach

                    <td class="stats-val" style="color: #059669;">{{ $stats['p'] }}</td>
                    <td class="stats-val" style="color: #dc2626;">{{ $stats['a'] }}</td>
                    <td class="stats-val" style="color: #d97706;">{{ $stats['l'] }}</td>
                    <td class="stats-val" style="color: #2563eb;">{{ $stats['e'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
