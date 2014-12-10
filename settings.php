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
 * @copyright  2013 Damyon Wiese
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$ADMIN->add('editoratto', new admin_category('atto_easychem', new lang_string('pluginname', 'atto_easychem')));

$settings = new admin_settingpage('atto_easychem_settings', new lang_string('settings', 'atto_easychem'));
if ($ADMIN->fulltree) {
    // Group 1
    $name = new lang_string('librarygroup1', 'atto_easychem');
    $desc = new lang_string('librarygroup1_desc', 'atto_easychem');
    $default = '
CH3
CH2
CH
OH
/\/
=
->
<->
<=>
"^o"
"|^"
"|v"
{R}
(CH2)\'n\'
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup1',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

    // Group 2
    $name = new lang_string('librarygroup2', 'atto_easychem');
    $desc = new lang_string('librarygroup2_desc', 'atto_easychem');
    $default = '
\leftarrow
\rightarrow
\uparrow
\downarrow
\leftrightarrow
\nearrow
\searrow
\swarrow
\nwarrow
\Leftarrow
\Rightarrow
\Uparrow
\Downarrow
\Leftrightarrow
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup2',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

    // Group 3
    $name = new lang_string('librarygroup3', 'atto_easychem');
    $desc = new lang_string('librarygroup3_desc', 'atto_easychem');
    $default = '
\alpha
\beta
\gamma
\delta
\epsilon
\zeta
\eta
\theta
\iota
\kappa
\lambda
\mu
\nu
\xi
\pi
\rho
\sigma
\tau
\upsilon
\phi
\chi
\psi
\omega
\Gamma
\Delta
\Theta
\Lambda
\Xi
\Pi
\Sigma
\Upsilon
\Phi
\Psi
\Omega
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup3',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

    // Group 4
    $name = new lang_string('librarygroup4', 'atto_easychem');
    $desc = new lang_string('librarygroup4_desc', 'atto_easychem');
    $default = '
\sum{a,b}
\int_{a}^{b}{c}
\iint_{a}^{b}{c}
\iiint_{a}^{b}{c}
\oint{a}
(a)
[a]
\lbrace{a}\rbrace
\left| \begin{matrix} a_1 & a_2 \\ a_3 & a_4 \end{matrix} \right|
';
    $setting = new admin_setting_configtextarea('atto_easychem/librarygroup4',
                                                $name,
                                                $desc,
                                                $default);
    $settings->add($setting);

}
