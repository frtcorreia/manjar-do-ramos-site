<div>
    <x-navbar :force-scrolled="true" />

    <main class="min-h-[80vh] pb-20 pt-32">
        <div class="mx-auto w-full max-w-md px-5">
            <h1 class="text-center font-serif text-4xl text-espresso">Bem-vindo</h1>
            <p class="mt-2 text-center text-sm text-muted-foreground">
                Aceda à sua conta ou crie uma para finalizar a encomenda.
            </p>

            <div class="mt-8 grid w-full grid-cols-2 rounded-lg bg-muted p-1">
                <button type="button" wire:click="$set('tab', 'login')"
                        class="rounded-md px-4 py-2 text-sm font-medium transition-all {{ $tab === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground' }}">
                    Entrar
                </button>
                <button type="button" wire:click="$set('tab', 'signup')"
                        class="rounded-md px-4 py-2 text-sm font-medium transition-all {{ $tab === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground' }}">
                    Criar conta
                </button>
            </div>

            @if ($tab === 'login')
                <form wire:submit="login" class="mt-6 space-y-4">
                    <div class="space-y-2">
                        <label for="login-email" class="text-sm font-medium">Email</label>
                        <input id="login-email" type="email" wire:model="loginEmail" autocomplete="email" required
                               class="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        @error('loginEmail') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                    </div>
                    <div class="space-y-2">
                        <label for="login-password" class="text-sm font-medium">Palavra-passe</label>
                        <input id="login-password" type="password" wire:model="loginPassword" autocomplete="current-password" required
                               class="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        @error('loginPassword') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                    </div>
                    <button type="submit" wire:loading.attr="disabled"
                            class="w-full rounded-lg bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90 disabled:opacity-60">
                        <span wire:loading.remove wire:target="login">Entrar</span>
                        <span wire:loading wire:target="login">A entrar…</span>
                    </button>
                </form>
            @else
                <form wire:submit="register" class="mt-6 space-y-4">
                    <div class="space-y-2">
                        <label for="signup-name" class="text-sm font-medium">Nome</label>
                        <input id="signup-name" type="text" wire:model="name" autocomplete="name" required
                               class="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        @error('name') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                    </div>
                    <div class="space-y-2">
                        <label for="signup-email" class="text-sm font-medium">Email</label>
                        <input id="signup-email" type="email" wire:model="email" autocomplete="email" required
                               class="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        @error('email') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                    </div>
                    <div class="space-y-2">
                        <label for="signup-password" class="text-sm font-medium">Palavra-passe</label>
                        <input id="signup-password" type="password" wire:model="password" autocomplete="new-password" required minlength="8"
                               class="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <p class="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
                        @error('password') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                    </div>
                    <button type="submit" wire:loading.attr="disabled"
                            class="w-full rounded-lg bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90 disabled:opacity-60">
                        <span wire:loading.remove wire:target="register">Criar conta</span>
                        <span wire:loading wire:target="register">A criar…</span>
                    </button>
                </form>
            @endif

            <p class="mt-6 text-center text-xs text-muted-foreground">
                <a href="{{ route('home') }}" class="hover:text-wine">← Voltar ao site</a>
            </p>
        </div>
    </main>

    <x-footer />
</div>
