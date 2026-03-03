import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    try {
        const payload = await req.json()
        console.log('Webhook payload received:', payload)

        // TODO: Implement actual signature verification here (e.g. Hotmart Hottok or Kiwify Signature)
        // using req.headers.get('x-kiwify-signature') or similar.

        // Generic extraction assuming simple payload structure for demonstration
        // Hotmart/Kiwify send different structures. This handles a generalized mock.
        const email = payload.buyer?.email || payload.email || payload.Customer?.email;
        const status = payload.status || payload.transaction?.status; // e.g. 'approved', 'paid', 'canceled'
        const planId = payload.plan?.id || payload.product?.id || 'monthly';

        if (!email) {
            return new Response(JSON.stringify({ error: 'Missing email in payload' }), { status: 400 })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Find user by email
        const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers()

        if (userError) {
            throw userError;
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            console.log(`User not found for email: ${email}`);
            // In a real app, you might create the user here generating a random password
            // and sending them a welcome email.
            return new Response(JSON.stringify({ message: 'User not found, ignoring webhook.' }), { status: 200 })
        }

        let subscription_status = 'trialing';
        let newExpiresAt = new Date();
        let plan_type = planId.toLowerCase().includes('year') || planId.includes('anual') ? 'anual' : 'mensal';

        // Map platforms statuses to your DB statuses
        const normalizedStatus = String(status).toLowerCase();

        if (normalizedStatus === 'approved' || normalizedStatus === 'paid' || normalizedStatus === 'active') {
            subscription_status = 'active';
            if (plan_type === 'anual') {
                newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1);
            } else {
                newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);
            }
        } else if (normalizedStatus === 'canceled' || normalizedStatus === 'refunded') {
            subscription_status = 'canceled';
            newExpiresAt = new Date(); // Expire immediately or on next cycle
        }

        // Update the profile
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                subscription_status,
                plan_type,
                expires_at: newExpiresAt.toISOString()
            })
            .eq('id', user.id)

        if (updateError) {
            throw updateError;
        }

        return new Response(
            JSON.stringify({ message: `Profile updated for ${email}`, status: subscription_status }),
            { headers: { 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        console.error('Webhook error:', err)
        return new Response(String(err?.message ?? err), { status: 500 })
    }
})
