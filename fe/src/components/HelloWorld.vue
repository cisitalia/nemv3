<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex mb-4>
        <v-parallax
        dark
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
        >
            <v-layout
            align-center
            column
            justify-center
            >
                <h1 class="display-2 font-weight-thin mb-3">Vuetify.js</h1>
            <h4 class="subheading">Build your application today!</h4>
            </v-layout>
        </v-parallax>
      </v-flex>

        <v-flex
        xs12
        mb-5
        >
            <!-- <h2 class="headline font-weight-bold mb-3">Important Links</h2>

            <v-layout justify-center>
                <a
                v-for="(link, i) in importantLinks"
                :key="i"
                :href="link.href"
                class="subheading mx-3"
                target="_blank"
                >
                    {{ link.text }}
                </a>
            </v-layout> -->

            <v-bottom-sheet v-model="sheet">
                <v-btn
                    slot="activator"
                    color="purple"
                    dark
                >
                    Show bottom sheet menu
                </v-btn>

                <v-list>
                    <v-subheader>Open in</v-subheader>
                    <v-list-tile
                        v-for="tile in titles"
                        :key="tile.title"
                        @click="sheet = false"
                    >
                        <v-list-tile-avatar>
                            <v-avatar size="32px" tile>
                                <img
                                    :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                                    :alt="tile.title"
                                >
                            </v-avatar>
                        </v-list-tile-avatar>
                        <v-list-tile-title>{{ tile.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-bottom-sheet>
        </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
export default {
    data: () => ({
        sheet: false,
        titles: [
            { img: 'keep.png', title: 'Keep' },
            { img: 'inbox.png', title: 'Inbox' },
            { img: 'hangouts.png', title: 'Hangouts' },
            { img: 'messenger.png', title: 'Messenger' },
            { img: 'google.png', title: 'Google+' }
        ]
    })
}
</script>

<style>

</style>
