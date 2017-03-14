/**
 * @file jquery.cronui.js
 * @brief jQuery plugin to generate cron string
 * @author Imants Cernovs <imantscernovs@inbox.lv>
 * @version 1.0.0
 */

(function($) {

    var $select_box = [];
    var $settings;

    var defaults = {
        initial : '* * * * *',
        dropDownClass: 'form-control',
        dropDownSizeClass: 'col-md-2',
        resultOutputId: 'result_out',
        lang: 'en'
    };

    /** Cron combinations for detecting cron type */
    var combinations = {
        'minute' : /^(\*\s){4}\*$/,                    // '* * * * *'
        'hour'   : /^\d{1,2}\s(\*\s){3}\*$/,           // '? * * * *'
        'day'    : /^(\d{1,2}\s){2}(\*\s){2}\*$/,      // '? ? * * *'
        'week'   : /^(\d{1,2}\s){2}(\*\s){2}\d{1,2}$/, // '? ? * * ?'
        'month'  : /^(\d{1,2}\s){3}\*\s\*$/,           // '? ? ? * *'
        'year'   : /^(\d{1,2}\s){4}\*$/                // '? ? ? ? *'
    };

    /** Public plugin methods */
    var methods = {
        init : function(options) {

            $settings = $.extend({}, defaults, options);
            /** Set default fallback language */
            $settings.lang = data.hasOwnProperty($settings.lang) ? $settings.lang : 'en';

            /** Generate inputs */
            $select_box['period'] =
                $('<div/>', {class: 'cron-period ' + $settings.dropDownSizeClass})
                    .append($('<label/>', {text: data[$settings.lang]['period']}))
                    .append($('<select/>', {id: 'period-box', class: 'cron-period-box ' + $settings.dropDownClass}))
                    .appendTo(this);

            $select_box['minute'] =
                $('<div/>', {class: 'cron-select cron-min ' + $settings.dropDownSizeClass})
                    .append($('<label/>', {text: data[$settings.lang]['minute']}))
                    .append($('<select/>', {id: 'min-box', class: 'cron-min-box ' + $settings.dropDownClass, disabled: true}))
                    .appendTo(this);

            $select_box['hour'] =
                $('<div/>', {class: 'cron-select cron-hour ' + $settings.dropDownSizeClass})
                    .append($('<label/>', {text: data[$settings.lang]['hour']}))
                    .append($('<select/>', {id: 'hour-box', class: 'cron-hour-box ' + $settings.dropDownClass, disabled: true}))
                    .appendTo(this);

            $select_box['month'] =
                $('<div/>', {class: 'cron-select cron-month ' + $settings.dropDownSizeClass})
                    .append($('<label/>', {text: data[$settings.lang]['month']}))
                    .append($('<select/>', {id: 'month-box', class: 'cron-month-box ' + $settings.dropDownClass, disabled: true}))
                    .appendTo(this);

            $select_box['dom'] =
                $('<div/>', {class: 'cron-select cron-dom ' + $settings.dropDownSizeClass})
                    .append($('<label/>', {text: data[$settings.lang]['dom']}))
                    .append($('<select/>', {id: 'dom-box', class: 'cron-dom-box ' + $settings.dropDownClass, disabled: true}))
                    .appendTo(this);

            $select_box['dow'] =
                $('<div/>', {class: 'cron-select cron-dow ' + $settings.dropDownSizeClass})
                    .append($('<label/>', {text: data[$settings.lang]['dow']}))
                    .append($('<select/>', {id: 'dow-box', class: 'cron-dow-box ' + $settings.dropDownClass, disabled: true}))
                    .appendTo(this);

            /** Populate selects with data*/
            populateOptions($select_box['period'].find('select').attr('id'), generatePeriods());
            populateOptions($select_box['minute'].find('select').attr('id'), generateNumbers(60));
            populateOptions($select_box['hour'].find('select').attr('id'), generateNumbers(24));
            populateOptions($select_box['month'].find('select').attr('id'), generateData('months'));
            populateOptions($select_box['dom'].find('select').attr('id'), generateMonthDays());
            populateOptions($select_box['dow'].find('select').attr('id'), generateData('days'));

            /** Activate inputs based on choosen period */
            $('select.cron-period-box').change(function () {
                activateInputs(this.value);
                $('#' + $settings.resultOutputId).val(methods['getValue'].call());
            }).change();

            $('.cron-select select').change(function () {
                var $result = methods['getValue'].call();
                $('#' + $settings.resultOutputId).val($result);
            });

            methods['setValue'].call(this, $settings.initial);

            $('#' + $settings.resultOutputId).val(methods['getValue'].call());

            return this;

        },

        setValue : function(cron_str) {

            /** Get cron type based on given string */
            var cron_type = getCronType(cron_str);
            $select_box['period'].find('select').val(cron_type);

            /** Activate inputs based on detected period */
            activateInputs(cron_type);

            var cron = cron_str.split(' ');
            var $values = {
                'minute' : cron[0],
                'hour'   : cron[1],
                'dom'    : cron[2],
                'month'  : cron[3],
                'dow'    : cron[4]
            };

            $.each($values, function (value, index) {
                if (index == '*') return;
                $select_box[value].find('select').val(index);
            });

            $('#' + $settings.resultOutputId).val(methods['getValue'].call());

        },

        getValue : function () {

            var min, hour, day, month, dow; min = hour = day = month = dow = '*';
            var $period    = $select_box['period'].find('select').val();

            switch ($period) {
                case 'hour':
                    min = $select_box['minute'].find('select').val();
                break;
                case 'day':
                    min  = $select_box['minute'].find('select').val();
                    hour = $select_box['hour'].find('select').val();
                break;
                case 'week':
                    min  = $select_box['minute'].find('select').val();
                    hour = $select_box['hour'].find('select').val();
                    dow  = $select_box['dow'].find('select').val();
                break;
                case 'month':
                    min  = $select_box['minute'].find('select').val();
                    hour = $select_box['hour'].find('select').val();
                    day  = $select_box['dom'].find('select').val();
                break;
                case 'year':
                    min   = $select_box['minute'].find('select').val();
                    hour  = $select_box['hour'].find('select').val();
                    day   = $select_box['dom'].find('select').val();
                    month = $select_box['month'].find('select').val();
                break;
            }

            return [min, hour, day, month, dow].join(' ');
        }

    };

    /**
     * Determine cron type based on cron string
     *
     * @param  {string} cron_str
     * @return {string}
     */
    var getCronType = function (cron_str) {

        /** validate cron string */
        validateCronString(cron_str);

        /** Determine cron type */
        for (var type in combinations) {
            if (combinations[type].test(cron_str)) { return type; }
        }

    };

    /**
     * Populate select boxes with options
     *
     * @param {object} $element
     * @param {Array} $options
     */
    var populateOptions = function ($element, $options) {
        $.each($options, function() {
            $('#' + $element).append($('<option />').val(this.val).text(this.text));
        });
    };

    /**
     * Generate number sequence
     *
     * @param  {int}$length
     * @return {Array}
     */
    var generateNumbers = function ($length) {
        return $.map($(new Array($length)),function(val, n) {
            var $text = (n > 9) ? n.toString() : '0' + n;
            return {val: n, text: $text};
        });
    };

    /**
     * Generate month days
     *
     * @return {Array}
     */
    var generateMonthDays = function () {
        var $dim = [];
        for (var $i = 1; $i <= 31; $i++) {
            $dim.push({val: $i, text: $i});
        }
        return $dim;
    };

    /**
     * Generate translated data
     *
     * @param  {string} $element
     * @return {Array}
     */
    var generateData = function ($element) {
        var $data_array = [];

        try {
            var $items = data[$settings.lang][$element];

            for (var $i = 1; $i <= $items.length; $i++) {
                $data_array.push({val: $i, text: $items[$i - 1]})
            }

        } catch (e) {
            console.error('Translation for ' + $element +' does not exists in cronui-' + $settings.lang);
        }

        return $data_array;
    };

    /**
     * Generate translated periods
     *
     * @return {Array}
     */
    var generatePeriods = function () {
        var $data_array = [];
        var $values     = ['minute', 'hour', 'day', 'week', 'month', 'year'];

        try {
            var $items = data[$settings.lang]['periods'];
            $.each($values, function (index, value) {
                $data_array.push({val: value, text: $items[index]});
            })
        } catch (e) {
            console.error('Translation for periods does not exists in cronui-' + $settings.lang);
        }

        return $data_array;
    };

    /**
     * Validate cron string correctness
     *
     * @param cron_str
     * @return {boolean}
     */
    var validateCronString = function (cron_str) {

        var cron       = cron_str.split(' ');
        var valid_cron = /^((\d{1,2}|\*)\s){4}(\d{1,2}|\*)$/;
        var minval     = [ 0,  0,  1,  1,  0]; // mm, hh, DD, MM, DOW
        var maxval     = [59, 23, 31, 12,  6]; // mm, hh, DD, MM, DOW

        /** Check format of initial cron value */
        if (typeof cron_str != 'string' || !valid_cron.test(cron_str)) {
            $.error('Invalid cron string');
            return false;
        }

        /** check actual cron values */
        $.each(cron, function (index, str) {
            if (str == '*') return;
            var cron_val = parseInt(str);
            if (cron_val <= maxval[index] && cron_val >= minval[index]) return;
            $.error('Invalid value found column: ' + (index + 1 ) + ' value: ' + (cron[index]));
            return false;
        });

    };

    /**
     * Activate inputs based on selected period
     *
     * @param {string} $period
     */
    var activateInputs = function ($period) {

        $('.cron-select').find('select').prop('disabled', true);

         var $min_box   = $select_box['minute'].find('select');
         var $hour_box  = $select_box['hour'].find('select');
         var $dom_box   = $select_box['dom'].find('select');
         var $month_box = $select_box['month'].find('select');
         var $dow_box   = $select_box['dow'].find('select');

         switch ($period) {
             case 'hour':
                 $min_box.prop('disabled', false);
             break;
             case 'day':
                 $min_box.prop('disabled', false);
                 $hour_box.prop('disabled', false);
             break;
             case 'week':
                 $min_box.prop('disabled', false);
                 $hour_box.prop('disabled', false);
                 $dow_box.prop('disabled', false);
             break;
             case 'month':
                 $min_box.prop('disabled', false);
                 $hour_box.prop('disabled', false);
                 $dom_box.prop('disabled', false);
             break;
             case 'year':
                 $min_box.prop('disabled', false);
                 $hour_box.prop('disabled', false);
                 $dom_box.prop('disabled', false);
                 $month_box.prop('disabled', false);
             break;
         }
    };

    $.fn.cronui = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }
    };

    /** Default plugin text */
    var data = $.fn.cronui.data = {
        'en': {
            periods: ['Minute', 'Hour', 'Day', 'Week', 'Month', 'Year'],
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'],
            period: 'Every',
            minute: 'Minute',
            hour: 'Hour',
            month: 'Month',
            dom: 'Day of month',
            dow: 'Day of week'
        }
    };

})(jQuery);
