<template>
<b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
        <b-card class="auth-card" no-body>
            <div class="position-relative image-side">
                <p class="text-white h2">POINTERP - Sistema Administrativo</p>
                <p class="white mb-0">
                    Digite sus credenciales de usuario para acceder.
                    <!--br />If you are not a member, please
                    <router-link tag="a" to="/user/register" class="white">register</router-link-->
                </p>
            </div>
            <div class="form-side">
                <router-link tag="a" to="/">
                    <span class="logo-single" />
                </router-link>
                <h6 class="mb-4">{{ $t('user.login-title')}}</h6>

                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group label="Usuario" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.crendencial.usuario.$model" :state="!$v.crendencial.usuario.$error" />
                        <b-form-invalid-feedback v-if="!$v.crendencial.usuario.required">Digite su codigo de usuario</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group label="Contraseña" class="has-float-label mb-4">
                        <b-form-input type="password" v-model="$v.crendencial.clave.$model" :state="!$v.crendencial.clave.$error" />
                        <b-form-invalid-feedback v-if="!$v.crendencial.clave.required">Digite su contraseña</b-form-invalid-feedback>
                    </b-form-group>
                    <div class="d-flex justify-content-between align-items-center">
                        <!--router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link-->
                        <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && loginError===false,
                    'show-fail': !processing && loginError }">
                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>
                            <span class="label">{{ $t('user.login-button') }}</span>
                        </b-button>
                    </div>
                </b-form>
            </div>
        </b-card>
    </b-colxx>
</b-row>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";
import {
    validationMixin
} from "vuelidate";
const {
    required,
} = require("vuelidate/lib/validators");

export default {
    data() {
			return {
				crendencial: {
					usuario: "",
					clave: ""
				},
			};
    },
    mixins: [validationMixin],
    validations: {
			crendencial: {
				clave: {
					required,
				},
				usuario: {
					required,
				}
			}
    },
    computed: {
      ...mapGetters(["currentUser", "processing", "loginError"])
    },
    methods: {
			...mapActions(["login"]),
			formSubmit() {
				this.$v.$touch();
				this.$v.crendencial.$touch();
				if (!this.$v.crendencial.$anyError) {
					this.login({
						usuario: this.crendencial.usuario,
						clave: this.crendencial.clave
					});
				}
			}
    },
    watch: {
			currentUser(val) {
				if (val && val.id && val.nombres.length > 0) {
					setTimeout(() => {
						this.$router.push("/");
					}, 200);
				}
			},
			loginError(val) {
				if (val != null) {
					this.$notify("error", "Login Error", val, {
						duration: 3000,
						permanent: false
					});
				}
			}
    }
};
</script>
