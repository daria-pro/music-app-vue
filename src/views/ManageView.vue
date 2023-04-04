<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <song-manage-item
              v-for="(song, index) in songs"
              :key="song.songId"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
              :song="song"
              :index="index"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import useUserStore from '@/stores/user'
import { songsCollection, auth } from '@/includes/firebase'
import { where, query, getDocs } from 'firebase/firestore'
import AppUpload from '@/components/Upload.vue'
import SongManageItem from '@/components/SongManageItem.vue'

export default {
  name: 'Manage',
  components: {
    AppUpload,
    SongManageItem
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  async created() {
    const snapshot = await getDocs(query(songsCollection, where('uid', '==', auth.currentUser.uid)))
    snapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(),
        songId: document.id
      }
      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
      next(leave)
    }
  }
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore()
  //   if (store.userLoggedIn) {
  //     next()
  //   } else {
  //     next({ name: 'home' })
  //   }
  // }
}
</script>
