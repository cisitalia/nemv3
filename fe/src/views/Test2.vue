<template>
    <v-container>
        <v-card class="mx-auto">
            <v-toolbar card dense>
                <v-btn icon>
                    <v-icon>equalizer</v-icon>
                </v-btn>
                <v-toolbar-title>Image ratio change</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon>loop</v-icon>
                </v-btn>
            </v-toolbar>
        </v-card>

        <v-slider v-model="width" min="200" max="500" step="1"></v-slider>

        <v-container fluid pt-0>
            <v-navigation-drawer
            :width="width"
            :value="true"
            stateless
            >
                <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
                    <v-layout pa-2 column fill-height class="lightbox white--text">
                        <v-spacer></v-spacer>
                        <v-flex shrink>
                            <div class="subheading">Jonathan Lee</div>
                            <div class="body-1">heyfromjonathan@gmail.com</div>
                        </v-flex>
                    </v-layout>
                </v-img>

                <v-list>
                    <template v-for="(item, i) in items">
                        <v-divider v-if="item.divider" :key="i"></v-divider>
                        <v-list-tile v-else :key="item.title" @click.stop>
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-navigation-drawer>
        </v-container>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        width: 300,
        items: [
            { icon: 'inbox', title: 'Inbox' },
            { icon: 'star', title: 'Starred' },
            { icon: 'send', title: 'Sent mail' },
            { icon: 'drafts', title: 'Drafts' },
            { divider: true },
            { icon: 'mail', title: 'All mail' },
            { icon: 'delete', title: 'Trash' },
            { icon: 'error', title: 'Spam' }
        ]
    })
}
</script>

<style scoped>
  .v-navigation-drawer {
    transition: none !important;
  }

  .lightbox {
    box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px);
  }
</style>
