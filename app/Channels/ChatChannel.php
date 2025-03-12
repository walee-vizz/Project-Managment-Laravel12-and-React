<?php

namespace App\Channels;

use App\Models\User;
use Laravel\Reverb\Protocols\Pusher\Channels\Channel;

class ChatChannel extends Channel
{
    public function join(User $user)
    {
        // Logic to authorize user joining the channel
    }

    public function leave(User $user)
    {
        // Logic to handle user leaving the channel
    }
}
