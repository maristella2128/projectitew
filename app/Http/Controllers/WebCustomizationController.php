<?php
 
namespace App\Http\Controllers;

use App\Models\WebCustomization;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;

class WebCustomizationController extends Controller
{
    public function index()
    {
        $customization = WebCustomization::first() ?: new WebCustomization(['settings' => self::getDefaults()]);
        return Inertia::render('Administration/WebCustomization', [
            'savedTheme' => $customization->settings,
        ]);
    }

    public function update(Request $request)
    {
        $customization = WebCustomization::first() ?: new WebCustomization();
        $customization->settings = $request->input('theme');
        $customization->save();

        return back()->with('success', 'System customization updated successfully.');
    }

    public static function getDefaults()
    {
        return [
            'primary' => '#f97316',
            'secondary' => '#fb923c',
            'background' => '#0c0805',
            'surface' => '#160e08',
            'border' => '#2a1508',
            'textPrimary' => '#fef3ec',
            'textMuted' => 'rgba(254,243,236,0.4)',
            'sidebar' => '#0c0805',
            'topbar' => '#0c0805',
            'danger' => '#ef4444',
            'warning' => '#f59e0b',
            'success' => '#22c55e',
            'info' => '#3b82f6',
            'displayFont' => "'Playfair Display', serif",
            'bodyFont' => "'DM Sans', sans-serif",
            'monoFont' => "'Space Mono', monospace",
            'fontSize' => 14,
            'fontWeight' => 700,
            'lineHeight' => "normal",
            'letterSpacing' => "normal",
            'radius' => 14,
            'gap' => 14,
            'sidebarW' => 280,
            'topbarH' => 64,
            'density' => "default",
            'layout' => "classic",
            'contentWidth' => "full",
            'buttonStyle' => "filled",
            'buttonShape' => "rounded",
            'inputStyle' => "outlined",
            'cardStyle' => "bordered",
            'shadowDepth' => "medium",
            'tableStyle' => "borderless",
            'avatarShape' => "rounded",
            'badgeShape' => "pill",
            'iconSize' => "medium",
            'iconStroke' => "1.5",
            'iconStyle' => "outline",
            'iconColor' => "brand",
            'darkMode' => true,
            'animations' => true,
            'ambientGlow' => true,
            'bgTexture' => "grid",
            'glassBlur' => 12,
            'hoverEffect' => "glow",
            'transSpeed' => "normal",
            'highContrast' => false,
            'reducedMotion' => false,
            'systemTitle' => "CCS Comprehensive Profiling System",
            'institution' => "Pamantasan ng Cabuyao",
            'deptAbbrev' => "CCS",
            'academicYear' => "2025–2026",
            'semester' => "1st Semester",
            'footerText' => "© 2025 Pamantasan ng Cabuyao · College of Computing Studies",
            'browserTabTitle' => "CCS ProFile · Login",
            'browserTabUrl' => "ccs.pnc.edu.ph/login",
            'browserTabTheme' => "dark",
            'browserTabAccent' => "#f97316",
            'alertBg' => "#0a1f0a",
            'alertBorder' => "#14532d55",
            'alertText' => "#4ade80",
            'alertIconColor' => "#4ade80",
            'alertMessage' => "",
            'alertPosition' => "top",
            'alertStyle' => "bar",
            'alertDismissable' => true,
            'showAlerts' => true,
            'icons' => [
                'nav_overview' => "LayoutDashboard",
                'nav_students' => "Users",
                'nav_faculty' => "GraduationCap",
                'nav_instruction' => "BookOpen",
                'nav_scheduling' => "Calendar",
                'nav_events' => "Star",
                'nav_reports' => "Database",
                'nav_settings' => "Settings",
                'top_bell' => "Bell",
                'top_search' => "Search",
                'kpi_students' => "Users",
                'kpi_faculty' => "GraduationCap",
                'kpi_sections' => "Layers",
                'kpi_gwa' => "TrendingUp",
                'action_plus' => "Plus",
                'action_download' => "Download",
                'action_upload' => "Upload",
                'action_eye' => "Eye",
                'brand_logo' => "Shield",
            ],
        ];
    }
}
