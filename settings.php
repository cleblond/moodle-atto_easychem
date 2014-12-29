<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Settings that allow configuration of the list of tex examples in the easychem editor.
 *
 * @package    atto_easychem
 * @copyright  2014 onward Carl LeBlond  <carl.leblond@iup.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$ADMIN->add('editoratto', new admin_category('atto_easychem', new lang_string('pluginname', 'atto_easychem')));

$settings = new admin_settingpage('atto_easychem_settings', new lang_string('settings', 'atto_easychem'));
if ($ADMIN->fulltree) {
    // Group 1.
    $name = new lang_string('librarygroup1', 'atto_easychem');
    $desc = new lang_string('librarygroup1_desc', 'atto_easychem');
    $default = '
CH3
CH2
CH
OH
H/O\H
H2C=CH2
/\/\
\
/
//
\\
=
<=>
->
->
<->
N2"|^"
H^+
Cl^-
Fe(iii)4[Fe(ii)(CN)6]3
Fe(OH)\'3-x\'O\'x/2\'
$M(235)U
CH2||CH2
H2C\\CH2
H2C//CH2
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup1',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

    // Group 2.
    $name = new lang_string('librarygroup2', 'atto_easychem');
    $desc = new lang_string('librarygroup2_desc', 'atto_easychem');
    $default = '
_p3_p3_p3
_p4_p4_p4_p4
_p5_p5_p5_p5_p5
_p6_p6_p6_p6_p6_p6
_p7_p7_p7_p7_p7_p7_p7
=_p3O_p3
`=_p3O_p3
 -_pp_pO_p_pp
=_q7_qq7_q7O_q7_qq7_q7
\||`/`\\`|//
H_(y0.5)C\\CH|CH`//C`\HC`||HC/#2; #5_(y0.5)H
`|_p7_p7_p7_p7_p7_p7_o_(y-1,N0)_q_q_q_q_o
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup2',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

    // Group 3.
    $name = new lang_string('librarygroup3', 'atto_easychem');
    $desc = new lang_string('librarygroup3_desc', 'atto_easychem');
    $default = '
CH3-CH2-OH
CH3|CH2|OH
H/O\H
H2C=CH2
CH2||CH2
H2C\\CH2
H2C//CH2
HC≡CH
\||`/`\\`|//
H-C-H; H|#C|H
{R}-C<\OH>//O
H-O-S-{}; O||#S||O
CH3-C-CH3; CH3|#C|OH
{R}-OH
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup3',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

    // Group 4.
    $name = new lang_string('librarygroup4', 'atto_easychem');
    $desc = new lang_string('librarygroup4_desc', 'atto_easychem');
    $default = '
H3BO3 + 3C2H5OH = (C2H5O)3B + 3H2O
CaCO3 "1000^oC"--> CaO + CO2"|^"
2$itemColor1(red)NaOH + $atomColor(blue)2H2SO4$atomColor() = $itemColor1(#F00)Na2SO4 + $color(#00F)H2"|^"
2NaOH + 2H2SO4 = Na2SO4 + H2"|^"
4Fe2+ + 3[Fe(CN)6]3 → FeIII4[FeII(CN)6]3"|v"
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup4',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

}
