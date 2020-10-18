import React, { Fragment, useEffect, useState } from "react"
import 'regenerator-runtime/runtime'

export default function PycolorePlaylist({apiHost}) {

    const [playlist, setPlaylist] = useState({})
    const [filteredPlaylist, setFilteredPlaylist] = useState([])

    useEffect(() => {
        async function fetchPlaylist() {
            const resp = await fetch(`${apiHost}/stations/pycolore/playlist/?shape=groupartist`)
            const json = await resp.json()
            setPlaylist(json)
            setFilteredPlaylist(json)
        }
        fetchPlaylist()
    }, [])


    const filterPlaylist = event => {
        let input = event.target.value.toLowerCase();
        let copyPlaylist = {...playlist}
        Object.keys(copyPlaylist).forEach(key => {
            copyPlaylist[key] = key.toLowerCase().includes(input) ?
                copyPlaylist[key] :
                filterArtist(copyPlaylist[key], input)
        });
        setFilteredPlaylist(copyPlaylist);
    }

    const filterArtist = (artistSongs, input) => {
        return artistSongs.filter(song => {
            return song.album.toLowerCase().includes(input) || song.title.toLowerCase().includes(input)
        })
    }

    const formattedPlaylist = formatPlaylist(filteredPlaylist)

    function formatPlaylist(playlist) {
        const groups = []
        for (let artist in playlist) {
            const songs = playlist[artist]
            const size = songs.length
            if (size == 0) continue;
            const songsRows = []
            for (let i = 1; i < size; i++) {
                songsRows.push(
                    <tr key={i}>
                        <td>{songs[i].title}</td>
                        <td>{songs[i].album}</td>
                    </tr>
                )
            }
            groups.push(
                <Fragment key={artist}>
                    <tr key={artist} className="artist-row">
                        <td></td>
                        <td colSpan='2' className='artist-cell'>{artist}</td>
                    </tr>
                    <tr key='0'>
                        <th className="artist-th" rowSpan={size} scope="rowgroup">{artist}</th>
                        <td>{songs[0].title}</td>
                        <td>{songs[0].album}</td>
                    </tr>
                    {songsRows}
                </Fragment>
            )
        }
        return groups
    }

    return <>
        <h2>Playlist Pycolore</h2>

        <div id="playlist-wrapper">
            <input type="text" placeholder="Rechercher un artiste, titre ou un album..." onChange={filterPlaylist}/>
            <table>
                <colgroup>
                    <col span='1' id="artist-col"/>
                    <col span='1' id="title-col"/>
                    <col span='1' id="album-col"/>
                </colgroup>
                <thead>
                    <tr>
                        <th>Artiste</th>
                        <th>Titre</th>
                        <th>Album Deezer</th>
                    </tr>
                </thead>
                <tbody>
                    {formattedPlaylist}
                </tbody>
            </table>
        </div>
    </>
}