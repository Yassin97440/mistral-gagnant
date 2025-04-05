<template>
  <div class="p-4 bg-interface-background">
    <h1 class="text-2xl font-bold text-primary mb-4">Exemple d'utilisation de Tailwind CSS</h1>
    
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-secondary mb-2">Couleurs principales</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-primary flex items-center justify-center text-white">Primary</div>
        <div class="w-24 h-24 bg-primary-dark flex items-center justify-center text-white">Primary Dark</div>
        <div class="w-24 h-24 bg-primary-light flex items-center justify-center text-white">Primary Light</div>
      </div>
    </section>
    
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-secondary mb-2">Couleurs secondaires</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-secondary flex items-center justify-center text-white">Secondary</div>
        <div class="w-24 h-24 bg-secondary-dark flex items-center justify-center text-white">Secondary Dark</div>
        <div class="w-24 h-24 bg-secondary-light flex items-center justify-center text-white">Secondary Light</div>
      </div>
    </section>
    
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-secondary mb-2">Couleurs de messages</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-user flex items-center justify-center text-white">User</div>
        <div class="w-24 h-24 bg-user-background flex items-center justify-center">User BG</div>
        <div class="w-24 h-24 bg-assistant flex items-center justify-center text-white">Assistant</div>
        <div class="w-24 h-24 bg-assistant-background flex items-center justify-center">Assistant BG</div>
      </div>
    </section>
    
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-secondary mb-2">Composants de chat</h2>
      
      <div class="messages-container h-64 border border-interface-border rounded p-4 mb-4">
        <div class="message-wrapper assistant-message mb-4">
          <div class="message-card bg-assistant-background p-3 text-black">
            Message de l'assistant
          </div>
        </div>
        
        <div class="message-wrapper user-message mb-4">
          <div class="message-card bg-user-background p-3 text-black">
            Message de l'utilisateur
          </div>
        </div>
      </div>
      
      <div class="chat-input-container">
        <textarea class="w-full p-2 border border-interface-border rounded" placeholder="Écrivez votre message ici..."></textarea>
        <div class="flex justify-end mt-2">
          <button class="bg-primary text-white px-4 py-2 rounded">Envoyer</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Exemple de composant pour démontrer l'utilisation de Tailwind CSS avec notre thème
</script> 