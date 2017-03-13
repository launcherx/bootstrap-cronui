# bootstrap-cronui
Plugin for generating cron string

## Plugin usage

Init crunui

```javascript
$('.cron-tab').cronui();
```

```
Default plugin options: 
  1. initial : '* * * * *',
  2. dropDownClass: 'form-control',
  3. dropDownSizeClass: 'col-md-2',
  4. resultOutputId: 'result_out'
  5. lang: 'en'
```

Set Value

```javascript
$.fn.cronui('setValue', '42 10 * * 5');
```

Get Value

```javascript
$.fn.cronui('getValue');
```

