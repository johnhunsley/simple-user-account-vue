<template>
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">

                <div class="modal-header">
                    <slot name="header">
                        <h3>Edit User</h3>
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                        body
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        footer
                        <button class="modal-default-button" @click="showModal = false">
                            OK
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modal',
    data () {
        return {}
    }
}
</script>