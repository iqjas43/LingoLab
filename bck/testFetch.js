fetch('http://127.0.0.1:5000/api/courses/module1')
    .then(res => res.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error(err));
