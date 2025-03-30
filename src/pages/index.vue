<script lang="ts" setup>
import { locStorage } from '@/stores/storage'

onMounted(() => {
    const nameStor: string | null = locStorage.getData('myname')
    console.log('nameStor', nameStor, nameStor === 'admin')
    if (nameStor) {
        if (nameStor === 'admin') {
            navigateTo('/admin_panel')
        } else if (nameStor === 'pole') {
            navigateTo('/playing_field')
        } else {
            navigateTo('/player_panel')
        }
    } else {
        navigateTo('/login')
    }
})
</script>

<style scoped lang="less"></style>
