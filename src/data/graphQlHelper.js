import { gql } from 'apollo-boost';

export default function buildGraphQlQuery(accommodationSlug, roomSlug) {
    const roomQry = roomSlug !== null ? `(where: { slug: "${roomSlug}"})`: "";

    return gql`
        query Establishments {
            establishments(where: { slug: "${accommodationSlug}"}) {
                id,
                name,
                slug,
                availability,
                short_description,
                long_description,
                type,
                address,
                city,
                zip,
                tagline,
                store,
                pet_friendly,
                rental_services,
                concierge,
                room_service,
                playroom,
                spa,
                gym,
                pool,
                default_img {
                    id, 
                    name, 
                    url
                }
                images {
                    id, 
                    name, 
                    url
                },
                rooms${roomQry} {
                    id,
                    name,
                    slug,
                    room_standard,
                    price,
                    description,
                    image {
                        id, 
                        name, 
                        url
                    }
                    gallery {
                        id, 
                        name, 
                        url
                    },
                    beds {
                        id,
                        name,
                        space
                    },
                    capacities {
                        id,
                        guests
                    },
                    accommodations {
                        id,
                        item_quantity,
                        item_slug
                    }
                }
            }
        }`;
}