```
enum Role {

}
```

```
enum Area {
    select = "Select",
    filter = "Filter",
    output = "Output"
}
```

```
interface Node {
    connectTo: string[],
    role: string
    area: string
}
```

```
interface Edge {

}
```