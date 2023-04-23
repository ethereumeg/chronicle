
const baseUrl = 'https://raw.githubusercontent.com/Department-of-Decentralization/3/master/src'

export async function data($) {

    async function loadPeople(type, role="speaker") {
        const str = await $.loadTextUrl(`${baseUrl}/assets/people/${type}/index.js`)
        const prep = str
            .split("\n").map(s => s.replace(/^\s+\/\/.+$/, "")).join("\n")
            .replace(/(\n|\s{2})/g,"")
            .match(/export default (\[[^\]]+\])/sm)[1]
            .replace(/image: require\(".\/([^\)]+)"\)/g, `image: "${baseUrl}/assets/people/${type}/$1"`)
            .replace(/(name|twitter|image|organization\d?|url|github):/g, "\"$1\":")
            .replace(/,}/g, "}")
            .replace(/,]/g, "]")
    
        return JSON.parse(prep).map(i => {
            i.roles = [ role ]
            if (i.organization) {
                i.caption = `[${i.organization.name}](${i.organization.url})`
                delete i.organization

                if (i.organization2) {
                    i.caption += `, [${i.organization2.name}](${i.organization2.url})`
                    delete i.organization2
                }
            }
            if (i.github) {
                i.github = i.github.match(/^https?:\/\/github.com\/([^\/]+)/)[1]
            }
            if (i.twitter) {
                i.twitter = i.twitter.match(/^https?:\/\/(mobile\.|)twitter\.com\/([^\/]+)/)[2]
            }
            return i
        })
    }

    return {
        contributors: [].concat(
            await loadPeople('judges', 'judge'),
            await loadPeople('mentors', 'mentor'),
            await loadPeople('team', 'team'),
            await loadPeople('keynotes', 'speaker')
        )
    }
}