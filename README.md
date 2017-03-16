# bootstrap-cronui
Plugin for generating cron string

## Plugin usage

Init crunui

```javascript
$('.cron-tab').cronui();
```

# Plugin options: 
| Name                  | Type                           | Default      | Description |     
| --------------------- | ------------------------------ |------------- | --------------------------------------------------------------
|  initial              | string                         | '* * * * *'  |  The initial option allows you the set the initial cron value.                                                                        
|  dropDownMultiple     | boolean                        | false        |  Allow to choose multiple values in dropdown                                                                                               
|  dropDownStyled       | boolean                        | false        |  Style dropdowns using bootstrap-select plugin                                                                                             
|  dropDownStyledFlat   | boolean                        | false        |  Style dropdowns without border radius                                                                                           
|  dropDownSizeClass    | string                         | 'col-md-2'   |  Set dropdown column size                                                                                                                  

Set Value

```javascript
$.fn.cronui('setValue', '42 10 * * 5');
```

Get Value

```javascript
$.fn.cronui('getValue');
```

## License
 
 Copyright (c) 2017 Imants Cernovs under the MIT License.
