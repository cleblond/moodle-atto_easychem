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
 * Atto text editor integration version file.
 *
 * @package    atto_easychem
 * @copyright  2014 onward Carl LeBlond  <carl.leblond@iup.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Get the list of strings for this plugin.
 * @param string $elementid
 */
function atto_easychem_strings_for_js() {
    global $PAGE;
    $PAGE->requires->strings_for_js(array('saveeasychem',
                                          'editeasychem',
                                          'preview',
                                          'update',
                                          'librarygroup1',
                                          'librarygroup2',
                                          'librarygroup3',
                                          'librarygroup4'),
                                    'atto_easychem');
}

/**
 * Set params for this plugin.
 *
 * @param string $elementid
 * @param stdClass $options - the options for the editor, including the context.
 * @param stdClass $fpoptions - unused.
 */
function atto_easychem_params_for_js($elementid, $options, $fpoptions) {
    global $DB, $PAGE, $CFG;

    // Format a string with the active filter set.
    // If it is modified - we assume that some sort of text filter is working in this context.

    $easychemfilteractive = false;
    $context = $options['context'];
    if (!$context) {
        $context = context_system::instance();
    }

    // Check to see if filter is active if so add easychem.js module.

    $filterenabled = array_key_exists('easychem', filter_get_active_in_context($context));
    if ($filterenabled) {
        $easychemfilteractive = true;
        $url = $CFG->wwwroot . '/filter/easychem/js/easychem.js';
        $url = new moodle_url($url);
        $moduleconfig = array(
            'name' => 'easychem',
            'fullpath' => $url
        );
        $PAGE->requires->js_module($moduleconfig);
    }

    $library = array(
            'group1' => array(
                'groupname' => 'librarygroup1',
                'elements' => get_config('atto_easychem', 'librarygroup1'),
            ),
            'group2' => array(
                'groupname' => 'librarygroup2',
                'elements' => get_config('atto_easychem', 'librarygroup2'),
            ),
            'group3' => array(
                'groupname' => 'librarygroup3',
                'elements' => get_config('atto_easychem', 'librarygroup3'),
            ),
            'group4' => array(
                'groupname' => 'librarygroup4',
                'elements' => get_config('atto_easychem', 'librarygroup4'),
            ));

    return array('texfilteractive' => $easychemfilteractive,
                 'contextid' => $context->id,
                 'library' => $library,
                 'docsurl' => 'http://easychem.org/en/rules');
}
