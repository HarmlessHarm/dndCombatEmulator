<template>
	<div class="login-container">
		<div id="login">
			<img class="logo" src="../assets/_img/logo/logo-main-alt.svg" alt="Harmless Key"/>
			<h2>Sign in</h2>
			<p v-if="error" class="red"><i class="fas fa-exclamation-triangle"></i> {{ error }}</p>
			<form v-on:submit.prevent>
				<q-input 
					dark filled square dense
					autocomplete="off" 
					type="text" 
					v-model="email" 
					name="email" 
					placeholder="Email" 
					class="email"
				/>
				<q-input 
					dark filled square dense
					autocomplete="off" 
					type="password" 
					v-model="password" 
					placeholder="password" 
					name="password"
				/>
				<button class="btn btn-block mt-3" @click="signIn()">Sign In <i class="fas fa-sign-in-alt"></i></button>
			</form>
			<a class="btn btn-block google my-2" @click="googleSignIn()"><img src="@/assets/_img/styles/google.png" alt="Google logo"/> Sign in with Google</a>

			<p class="text-center mb-1"><small><router-link to="/forgot-password">Forgot password?</router-link></small></p>
			<div class="text-center"><small>No account yet? <router-link to="/sign-up">Create one here.</router-link></small></div>
		</div>
	</div>
</template>

<script>
	import { firebase, auth } from '@/firebase'

	export default {
		name: 'login',
		data() {
			return {
				email: '',
				password: '',
				error: '',
			}
		},
		methods: {
			signIn: function() {
				auth.signInWithEmailAndPassword(this.email, this.password).then(
					// eslint-disable-next-line
					(user) => {
						this.$router.replace('content')
					},
					(err) => {
						this.error = err.message;
					}
					);
			},
			googleSignIn() {
				const provider = new firebase.auth.GoogleAuthProvider();

				auth.signInWithPopup(provider).then(() => {
					this.$router.replace('content');
				}).catch((err) => {
					this.error = err.message;
				});
			},
		},
	}
</script>
