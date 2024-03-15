export function mapToJson(map: any) {
    var obj = Object.create(null)
    for (var [k, v] of map) {
        obj[k] = v
    }
    return obj
}