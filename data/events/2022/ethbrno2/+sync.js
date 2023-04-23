export async function data($) {

    const baseUrl = 'https://git.gwei.cz/ethbrno/eb2-website/raw/branch/main'
    const data = await $.loadYAMLUrl(`${baseUrl}/data/data.yaml`)
    return {
        contributors: data.contributors.map(c => ({
            name: c.name,
            caption: c.bio,
            twitter: c.twitter,
            image: `${baseUrl}/static/photos/contributors/${c.id}.jpg`,
            roles: c.roles
        }))
    }
}