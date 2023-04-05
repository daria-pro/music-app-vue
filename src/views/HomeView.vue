<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
          augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <song-play-item v-for="song in songs" :key="song.docId" :song="song" />
      </ol>
    </div>
  </section>
</template>

<script>
import { getDocs, getDoc, limit, query, startAfter, doc, orderBy } from 'firebase/firestore'
import { songsCollection } from '@/includes/firebase'
import SongPlayItem from '../components/SongPlayItem.vue'

export default {
  name: 'Home',
  components: { SongPlayItem },
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false
    }
  },
  async created() {
    this.getSongs()

    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return
      }

      this.pendingRequest = true

      let snapshots
      if (this.songs.length) {
        const lastDocRef = doc(songsCollection, this.songs[this.songs.length - 1].docId)
        const lastDocSnapshot = await getDoc(lastDocRef)
        const songsQuery = query(
          songsCollection,
          orderBy('modified_name'),
          startAfter(lastDocSnapshot),
          limit(this.maxPerPage)
        )
        snapshots = await getDocs(songsQuery)
      } else {
        const songsQuery = query(songsCollection, orderBy('modified_name'), limit(this.maxPerPage))
        snapshots = await getDocs(songsQuery)
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docId: document.id,
          ...document.data()
        })
      })

      this.pendingRequest = false
    }
  }
}
</script>
