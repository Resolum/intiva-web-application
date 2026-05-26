<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLogo from '@/shared/components/AppLogo.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import { useAuthService } from '@/iam/login/application/auth.service'

const { t } = useI18n()
const { signIn } = useAuthService()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const globalError = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    globalError.value = ''
    await signIn(email.value, password.value)
  } catch (error) {
    if (error.message.startsWith('login.errors.')) {
      globalError.value = t(error.message)
    } else {
      globalError.value = error.message || t('login.errors.serverError')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-layout">
    <div class="cyber-glow-1"></div>
    <div class="cyber-glow-2"></div>
    <div class="cyber-scanner"></div>

    <div class="login-left">
      <div class="cyber-grid-drift"></div>
      
      <div class="login-left__content">
        <AppLogo variant="light" class="login-left__logo" />
        
        <h1 class="login-left__tagline">
          <span class="login-left__tagline-top glitch-text" :data-text="t('login.leftPanel.tagline')">
            {{ t('login.leftPanel.tagline') }}
          </span>
          <span class="login-left__tagline-highlight glitch-text" :data-text="t('login.leftPanel.taglineHighlight')">
            {{ t('login.leftPanel.taglineHighlight') }}
          </span>
        </h1>
        
        <p class="login-left__description">
          {{ t('login.leftPanel.description') }}
        </p>

        <div class="cyber-hud">
          <div class="cyber-hud__header">
            <div class="cyber-hud__status-dot"></div>
            <span class="cyber-hud__title">SECURE GATEWAY CLIENT</span>
            <span class="cyber-hud__node">NODE // ONLINE</span>
          </div>
          <div class="cyber-hud__body">
            <div class="cyber-hud__line"><span class="cyber-hud__symbol">></span> PROTOCOL: <span class="cyber-hud__val-primary">OIDC_SECURE_AUTH</span></div>
            <div class="cyber-hud__line"><span class="cyber-hud__symbol">></span> VAULT_STATUS: <span class="cyber-hud__val-secondary">ENCRYPTED_SHA256</span></div>
            <div class="cyber-hud__line"><span class="cyber-hud__symbol">></span> NETWORK_LAT: <span class="cyber-hud__val-tertiary">0.02ms [STABLE]</span></div>
            <div class="cyber-hud__line cyber-hud__line--pulse"><span class="cyber-hud__symbol">></span> SHELL_STATE: <span class="cyber-hud__val-secondary">AWAITING_IDENT_SEQUENCE_</span></div>
          </div>
          <div class="cyber-hud__footer">
            <span>SYS_OK</span>
            <span>INTV_CORE_V2.6</span>
          </div>
        </div>
      </div>
      
      <div class="login-left__footer">
        <a href="#" class="login-left__link">
          <span class="cyber-link-bracket">[</span>
          {{ t('login.privacy') }}
          <span class="cyber-link-bracket">]</span>
        </a>
        <a href="#" class="login-left__link">
          <span class="cyber-link-bracket">[</span>
          {{ t('login.terms') }}
          <span class="cyber-link-bracket">]</span>
        </a>
      </div>
    </div>

    <div class="login-right">
      <div class="login-right__content">
        <div class="cyber-corner cyber-corner--top-left"></div>
        <div class="cyber-corner cyber-corner--top-right"></div>
        <div class="cyber-corner cyber-corner--bottom-left"></div>
        <div class="cyber-corner cyber-corner--bottom-right"></div>
        
        <div class="cyber-panel-tag">
          <span>SECURE_SESSION // ACCESS_REQD</span>
        </div>

        <div class="login-right__header">
          <h2 class="login-right__title">{{ t('login.title') }}</h2>
          <p class="login-right__subtitle">
            <span class="cyber-sub-arrow">></span> {{ t('login.subtitle') }}
          </p>
        </div>

        <div v-if="globalError" class="login-right__error-alert">
          <div class="cyber-error-bar"></div>
          <i class="pi pi-exclamation-triangle"></i>
          <span class="cyber-error-msg">{{ globalError }}</span>
        </div>

        <form class="login-right__form" @submit.prevent="handleLogin">
          <div class="cyber-input-field-group">
            <BaseInput 
              v-model="email" 
              :label="t('login.emailLabel')" 
              :placeholder="t('login.emailPlaceholder')" 
              type="email" 
              icon="pi pi-envelope" 
            />
            <div class="cyber-input-accent"></div>
          </div>
          
          <div class="cyber-input-field-group">
            <BaseInput 
              v-model="password" 
              :label="t('login.passwordLabel')" 
              :placeholder="t('login.passwordPlaceholder')" 
              type="password" 
              icon="pi pi-lock" 
            />
            <div class="cyber-input-accent"></div>
          </div>

          <div class="login-right__form-options">
            <label class="login-right__checkbox-label">
              <input type="checkbox" class="login-right__checkbox" />
              <span class="login-right__checkbox-custom"></span>
              <span class="login-right__checkbox-text">{{ t('login.rememberMe') }}</span>
            </label>
            <a href="#" class="login-right__forgot-link">
              <span class="forgot-arrow">&lt;</span> {{ t('login.forgotPassword') }} <span class="forgot-arrow">&gt;</span>
            </a>
          </div>

          <div class="cyber-button-frame">
            <BaseButton 
              type="submit" 
              :label="t('login.signInButton')" 
              variant="primary" 
              :loading="isLoading" 
            />
          </div>
        </form>

        <div class="login-right__divider">
          <span class="cyber-divider-bracket">[</span>
          <span class="cyber-divider-text">{{ t('login.orContinueWith') }}</span>
          <span class="cyber-divider-bracket">]</span>
        </div>

        <BaseButton 
          :label="t('login.googleButton')" 
          variant="google" 
          type="button" 
          class="cyber-google-btn"
        />

        <p class="login-right__register-prompt">
          {{ t('login.noAccount') }}
          <a href="#" class="login-right__register-link">
            <span class="register-symbol">//</span> {{ t('login.register') }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cyber-grid-drift {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(var(--color-primary) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.15;
  pointer-events: none;
}

.login-left__content {
  max-width: 480px;
  margin: auto;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-left__logo {
  margin-bottom: clamp(24px, 4vh, 48px);
}

.login-left__tagline {
  font-family: var(--font-headline, 'Manrope', sans-serif);
  font-size: clamp(2.2rem, 4.5vh, 3.25rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 clamp(12px, 2vh, 24px) 0;
  letter-spacing: -1.5px;
}
.login-left__tagline-top {
  display: block;
  color: #ffffff;
}
.login-left__tagline-highlight {
  color: var(--color-secondary);
  display: block;
  text-shadow: 0 0 10px rgba(205, 235, 69, 0.3);
}

.login-left__description {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: clamp(0.95rem, 1.3vh, 1.05rem);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0 0 clamp(16px, 3vh, 40px) 0;
}

.cyber-hud {
  background: rgba(13, 11, 26, 0.65);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  padding: clamp(14px, 2vh, 20px);
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}

.cyber-hud__header {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(83, 74, 183, 0.2);
  padding-bottom: 8px;
  margin-bottom: 12px;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.cyber-hud__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  box-shadow: 0 0 8px var(--color-secondary);
  animation: pulseLed 1.5s infinite ease-in-out;
}

.cyber-hud__title {
  color: #ffffff;
  font-weight: 700;
}

.cyber-hud__node {
  color: var(--color-neutral);
  margin-left: auto;
}

.cyber-hud__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.cyber-hud__line {
  color: var(--color-text-muted);
}

.cyber-hud__symbol {
  color: var(--color-primary);
  margin-right: 6px;
  font-weight: bold;
}

.cyber-hud__val-primary { color: #ffffff; }
.cyber-hud__val-secondary { color: var(--color-secondary); }
.cyber-hud__val-tertiary { color: var(--color-tertiary); }

.cyber-hud__line--pulse {
  animation: slowBlink 2s infinite ease-in-out;
}

.cyber-hud__footer {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(83, 74, 183, 0.15);
  margin-top: 12px;
  padding-top: 8px;
  font-size: 0.65rem;
  color: var(--color-neutral);
}

.login-left__footer {
  width: 100%;
  max-width: 480px;
  display: flex;
  gap: 24px;
  z-index: 2;
}
.login-left__link {
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
}
.login-left__link:hover {
  color: var(--color-secondary);
  text-shadow: 0 0 8px rgba(205, 235, 69, 0.4);
}
.cyber-link-bracket {
  color: var(--color-primary);
  margin: 0 4px;
  transition: color 0.2s;
}
.login-left__link:hover .cyber-link-bracket {
  color: var(--color-secondary);
}

.login-right__content {
  width: 100%;
  max-width: 440px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(83, 74, 183, 0.15),
    inset 0 0 20px rgba(83, 74, 183, 0.05);
  border-radius: 4px;
  padding: clamp(24px, 4.5vh, 48px) clamp(24px, 4vw, 48px);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px);
}

.cyber-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--color-secondary);
  border-style: solid;
  pointer-events: none;
  opacity: 0.8;
  z-index: 4;
}
.cyber-corner--top-left {
  top: 10px; left: 10px;
  border-width: 2px 0 0 2px;
}
.cyber-corner--top-right {
  top: 10px; right: 10px;
  border-width: 2px 2px 0 0;
}
.cyber-corner--bottom-left {
  bottom: 10px; left: 10px;
  border-width: 0 0 2px 2px;
}
.cyber-corner--bottom-right {
  bottom: 10px; right: 10px;
  border-width: 0 2px 2px 0;
}

.cyber-panel-tag {
  position: absolute;
  top: 12px;
  right: 24px;
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  font-size: 0.6rem;
  color: var(--color-secondary);
  letter-spacing: 1px;
  opacity: 0.7;
}

.login-right__header {
  margin-bottom: clamp(16px, 3vh, 36px);
}

.login-right__title {
  font-family: var(--font-headline, 'Manrope', sans-serif);
  font-size: clamp(1.8rem, 3.5vh, 2.25rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.75px;
}

.login-right__subtitle {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: clamp(0.85rem, 1.2vh, 0.95rem);
  color: var(--color-text-muted);
  margin: 0;
}
.cyber-sub-arrow {
  color: var(--color-secondary);
  font-weight: 700;
}

.login-right__error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: rgba(138, 73, 0, 0.15);
  border: 1px solid var(--color-tertiary);
  color: #ffa43a;
  border-radius: 4px;
  margin-bottom: 24px;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  box-shadow: 0 0 10px rgba(138, 73, 0, 0.2);
}

.cyber-error-bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background-color: var(--color-tertiary);
  box-shadow: 0 0 8px var(--color-tertiary);
}

.login-right__form {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 20px);
  margin-bottom: clamp(16px, 2.5vh, 28px);
}

.cyber-input-field-group {
  position: relative;
  width: 100%;
}

:deep(.base-input__field) {
  background: rgba(6, 5, 11, 0.75) !important;
  border: 1.5px solid var(--color-border) !important;
  border-radius: 4px !important;
  color: #ffffff !important;
  font-family: var(--font-body) !important;
  height: 50px !important;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}

:deep(.base-input__field:focus) {
  border-color: var(--color-secondary) !important;
  box-shadow: 
    0 0 15px rgba(205, 235, 69, 0.15),
    inset 0 0 8px rgba(205, 235, 69, 0.05) !important;
}

:deep(.base-input__label) {
  color: var(--color-secondary) !important;
  font-family: var(--font-label) !important;
  font-size: 0.8rem !important;
  letter-spacing: 0.75px !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
}

:deep(.base-input__icon-leading) {
  color: var(--color-neutral) !important;
}

:deep(.base-input__field:focus + .base-input__icon-leading),
:deep(.base-input__field:focus ~ .base-input__icon-leading) {
  color: var(--color-secondary) !important;
}

:deep(.base-input__toggle) {
  color: var(--color-neutral) !important;
}
:deep(.base-input__toggle:hover) {
  color: var(--color-secondary) !important;
}

.cyber-input-accent {
  position: absolute;
  bottom: 0; left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-secondary);
  box-shadow: 0 0 8px var(--color-secondary);
  transition: width 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.cyber-input-field-group:focus-within .cyber-input-accent {
  width: 100%;
}


.login-right__form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.login-right__checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  user-select: none;
  position: relative;
}

.login-right__checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0; width: 0;
}

.login-right__checkbox-custom {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  background: rgba(6, 5, 11, 0.8);
  border: 1.5px solid var(--color-border);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.login-right__checkbox-custom::after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 1.5px;
  width: 5px;
  height: 9px;
  border: solid var(--color-secondary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-right__checkbox:checked ~ .login-right__checkbox-custom {
  border-color: var(--color-secondary);
  box-shadow: 0 0 8px rgba(205, 235, 69, 0.3);
}

.login-right__checkbox:checked ~ .login-right__checkbox-custom::after {
  display: block;
}

.login-right__checkbox-text {
  transition: color 0.2s;
}
.login-right__checkbox-label:hover .login-right__checkbox-text {
  color: #ffffff;
}

.login-right__forgot-link {
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.login-right__forgot-link:hover {
  color: var(--color-secondary);
  text-shadow: 0 0 6px rgba(205, 235, 69, 0.3);
}
.forgot-arrow {
  opacity: 0;
  transition: opacity 0.2s;
}
.login-right__forgot-link:hover .forgot-arrow {
  opacity: 1;
}

.cyber-button-frame {
  margin-top: 10px;
  position: relative;
}

:deep(.base-button--primary) {
  background: linear-gradient(135deg, var(--color-primary) 0%, #3e3794 100%) !important;
  border: 1.5px solid rgba(83, 74, 183, 0.5) !important;
  border-radius: 2px !important;
  color: #ffffff !important;
  font-family: var(--font-label, 'Space Grotesk', sans-serif) !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  font-weight: 700 !important;
  height: 50px !important;
  box-shadow: 0 0 15px rgba(83, 74, 183, 0.35) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)) !important;
  position: relative;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}

:deep(.base-button--primary:hover:not(.base-button--disabled)) {
  background: linear-gradient(135deg, #645bc8 0%, var(--color-primary) 100%) !important;
  border-color: var(--color-secondary) !important;
  box-shadow: 
    0 0 22px rgba(83, 74, 183, 0.5), 
    0 0 8px rgba(205, 235, 69, 0.4) !important;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8) !important;
  transform: translateY(-1px) !important;
}

:deep(.base-button--primary:active:not(.base-button--disabled)) {
  transform: translateY(1px) !important;
}

.login-right__divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: clamp(16px, 2.5vh, 32px) 0 clamp(12px, 2vh, 24px) 0;
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
}

.cyber-divider-bracket {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 1.1rem;
}

.cyber-divider-text {
  flex: 1;
  padding: 0 12px;
  font-size: 0.8rem;
  color: var(--color-neutral);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.cyber-google-btn {
  background: rgba(13, 11, 26, 0.5) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 2px !important;
  color: #ffffff !important;
  font-family: var(--font-label, 'Space Grotesk', sans-serif) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.75px !important;
  font-size: 0.9rem !important;
  height: 48px !important;
  transition: all 0.3s ease !important;
}

.cyber-google-btn:hover:not(.base-button--disabled) {
  background: rgba(83, 74, 183, 0.15) !important;
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 12px rgba(83, 74, 183, 0.25) !important;
}

.login-right__register-prompt {
  margin-top: clamp(16px, 3vh, 36px);
  text-align: center;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.login-right__register-link {
  font-weight: 700;
  color: var(--color-secondary);
  text-decoration: none;
  margin-left: 6px;
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  transition: all 0.2s;
  text-shadow: 0 0 5px rgba(205, 235, 69, 0.1);
}

.login-right__register-link:hover {
  text-shadow: 0 0 10px rgba(205, 235, 69, 0.5);
  color: #ffffff;
}

.register-symbol {
  color: var(--color-primary);
  margin-right: 4px;
}

.glitch-text {
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: transparent;
  pointer-events: none;
}
.glitch-text::before {
  left: 2px;
  text-shadow: -2px 0 var(--color-secondary);
  clip-path: inset(20% 0 70% 0);
  animation: glitch-anim-1 5s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: 2px 0 var(--color-primary);
  clip-path: inset(65% 0 25% 0);
  animation: glitch-anim-2 5s infinite linear alternate-reverse;
}

@keyframes pulseLed {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 12px var(--color-secondary); }
}

@keyframes slowBlink {
  0%, 100% { opacity: 0.65; }
  50% { opacity: 1; }
}

@keyframes glitch-anim-1 {
  0% { clip-path: inset(20% 0 70% 0); }
  10% { clip-path: inset(80% 0 10% 0); }
  20% { clip-path: inset(40% 0 50% 0); }
  30% { clip-path: inset(10% 0 85% 0); }
  40% { clip-path: inset(75% 0 15% 0); }
  50% { clip-path: inset(90% 0 5% 0); }
  60% { clip-path: inset(5% 0 90% 0); }
  70% { clip-path: inset(60% 0 35% 0); }
  80% { clip-path: inset(30% 0 65% 0); }
  90% { clip-path: inset(85% 0 10% 0); }
  100% { clip-path: inset(15% 0 80% 0); }
}

@keyframes glitch-anim-2 {
  0% { clip-path: inset(65% 0 25% 0); }
  11% { clip-path: inset(10% 0 85% 0); }
  22% { clip-path: inset(80% 0 15% 0); }
  33% { clip-path: inset(95% 0 3% 0); }
  44% { clip-path: inset(25% 0 70% 0); }
  55% { clip-path: inset(5% 0 90% 0); }
  66% { clip-path: inset(40% 0 55% 0); }
  77% { clip-path: inset(85% 0 10% 0); }
  88% { clip-path: inset(10% 0 80% 0); }
  99% { clip-path: inset(90% 0 5% 0); }
  100% { clip-path: inset(75% 0 20% 0); }
}

@media (max-width: 1100px) {
  .login-layout { grid-template-columns: 1fr; }
  .login-left { display: none; }
  .login-right { padding: 48px 24px; }
}
</style>

