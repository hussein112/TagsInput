# CSVInput

Bootstrap Tags input. <br>
Example use case: tags in a blog

[Demo](https://hussein112.github.io/TagsInputDemo)

## Features

- Insert values separated by a trigger (keyboard key) you specify. (e.g., '-', ',', 'Enter'...)
- Insert tag values from ``` <select> ```
- Sends the data through axios

## Usage

> Requires Bootstrap (CSS Only) 5.2.x <br>
`` <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"> ``

## Implementation

1. Download or Through CDN: 
> ``<script src="https://cdn.jsdelivr.net/gh/hussein112/TagsInput@1.0.0/tagsinput.js"></script>``
> ``<script src="https://cdn.jsdelivr.net/gh/hussein112/TagsInput@1.0.0/tagsinput.min.js"></script>``
2. Add ``<div id="hk-input-csv"></div>``

3. create config object
    - e.g., `` const config = {
                form_title: "Test",
                input_place_holder: "Placeholder",
                trigger: ",",
                max: 3,
                list_place_holder: "List Place Holder",
                axios : {
                    on: true,
                    url: "receive.php", // url to the script that will handle the axios request.
                    trigger: ".send-data" // Valid CSS Selector for the button that sends the post axios request when clicked.
                }
            }``
3. instantiate class
    - > `` window.tagsinput = new TagsInput(config);``
4. Done !

## Examples

### Using `` <select> `` Input

```
<select name="tags" onchange="window.tagsinput.manualTag(this)">
    <option value="1">Tag 1</option>
    <option value="1">Tag 2</option>
    ....
</select>
```

### Using Axios

```
<form action="#" method="post">
        <div id="hk-input-csv"></div>
        <button type="button" class="send-data">ok</button>
</form>
```

```
const config = {
    ....
    axios : {
        on: true,
        url: "receive.php",
        trigger: ".send-data"
    }
}
```

> receive.php file
```
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $tags = file_get_contents("php://input");
    file_put_contents('tags.json', $tags);
}
```