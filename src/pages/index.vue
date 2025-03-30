<script lang="ts" setup>
import { locStorage } from '@/stores/storage'

onMounted(() => {
    const nameStor: string | null = locStorage.getData('myname')
    if (nameStor === 'admin') {
        navigateTo('/admin_panel')
    }
    if (nameStor === 'pole') {
        navigateTo('/playing_field')
    }
    if (nameStor) {
        navigateTo('/player_panel')
    } else {
        navigateTo('/login')
    }
})
</script>

<style scoped lang="less"></style>
