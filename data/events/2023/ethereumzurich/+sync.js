
export async function data($) {

    const data = await $.loadJSONUrl("https://graphql.contentful.com/content/v1/spaces/6j1me6tz5h39/environments/master", {
        "headers": {
            "accept": "*/*",
            "accept-language": "cs,en-US;q=0.9,en;q=0.8,sk;q=0.7,cy;q=0.6,pl;q=0.5",
            "authorization": "Bearer 7xdKQm9l5CXQE6tXXKYxNQ_lgvanmpdUgT20pIlxfOk",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://ethereumzuri.ch/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"query\":\"{\\n      ethereumZurichPeopleOrderCollection(limit: 1) {\\n        items {\\n          peopleOrderCollection(limit: 500) {\\n            items {\\n              sys {\\n                id\\n              }\\n              ... on EthZurichPeople {\\n                sys {\\n                  id\\n                }\\n                name\\n                twitter\\n                role\\n                company\\n                profileImage {\\n                  sys {\\n                    publishedAt\\n                    id\\n                  }\\n                  fileName\\n                  url\\n                }\\n              }\\n            }\\n          }\\n        }\\n      }\\n      ethZurichContentCollection(limit: 1)  {\\n        items {\\n          twitterLink\\n          telegramLink\\n          applyToSpeakLink\\n          applyToSpeakLabel\\n          applyToHackLink\\n          applyToHackLabel\\n          getTicketsLabel\\n          getTicketsLink\\n          applyToVolunteerLink\\n          applyToVolunteerLabel\\n          sponsorEthereumZurichLabel\\n          duckTapeLink\\n          paralelniPolisLink\\n          pitchDeck {\\n            url\\n          }\\n          hackathonText {\\n            json\\n            links {\\n              entries {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                }\\n              }\\n              assets {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                  url\\n                  title\\n                  width\\n                  height\\n                }\\n              }\\n            }\\n          }\\n          manifestoText {\\n            json\\n            links {\\n              entries {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                }\\n              }\\n              assets {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                  url\\n                  title\\n                  width\\n                  height\\n                }\\n              }\\n            }\\n          }\\n          faqWhatToExpectOnSiteLabel\\n          faqWhatToExpectOnSiteText {\\n            json\\n            links {\\n              entries {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                }\\n              }\\n              assets {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                  url\\n                  title\\n                  width\\n                  height\\n                }\\n              }\\n            }\\n          }\\n          faqLocationLabel\\n          faqLocationText {\\n            json\\n            links {\\n              entries {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                }\\n              }\\n              assets {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                  url\\n                  title\\n                  width\\n                  height\\n                }\\n              }\\n            }\\n          }\\n          faqSleepAndRestLabel\\n          faqSleepAndRestText {\\n            json\\n            links {\\n              entries {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                }\\n              }\\n              assets {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                  url\\n                  title\\n                  width\\n                  height\\n                }\\n              }\\n            }\\n          }\\n          faqAboutZurichLabel\\n          faqAboutZurichText {\\n            json\\n            links {\\n              entries {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                }\\n              }\\n              assets {\\n                block {\\n                  sys {\\n                    id\\n                  }\\n                  url\\n                  title\\n                  width\\n                  height\\n                }\\n              }\\n            }\\n          }\\n          isSectionFaqVisible\\n        }\\n      }\\n      ethereumZurichSponsorsCollection {\\n        items {\\n          name\\n          link\\n          logo {\\n            sys {\\n              publishedAt\\n              id\\n            }\\n            fileName\\n            url\\n          }\\n          tier\\n        }\\n      }\\n    }\"}",
        "method": "POST"
    });

    return {
        contributors: data.data.ethereumZurichPeopleOrderCollection.items[0].peopleOrderCollection.items.filter(c => c !== null).map(c => {
            const twitterMatch = c.twitter ? c.twitter.match(/twitter\.com\/([^\/^\?]+)/) : false
            return {
                name: c.name,
                twitter: twitterMatch ? twitterMatch[1] : undefined,
                roles: c.role,
                caption: c.company,
                image: c.profileImage.url
            }
        })
    }
}