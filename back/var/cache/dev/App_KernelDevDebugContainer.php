<?php

// This file has been auto-generated by the Symfony Dependency Injection Component for internal use.

if (\class_exists(\ContainerT9jS8wx\App_KernelDevDebugContainer::class, false)) {
    // no-op
} elseif (!include __DIR__.'/ContainerT9jS8wx/App_KernelDevDebugContainer.php') {
    touch(__DIR__.'/ContainerT9jS8wx.legacy');

    return;
}

if (!\class_exists(App_KernelDevDebugContainer::class, false)) {
    \class_alias(\ContainerT9jS8wx\App_KernelDevDebugContainer::class, App_KernelDevDebugContainer::class, false);
}

return new \ContainerT9jS8wx\App_KernelDevDebugContainer([
    'container.build_hash' => 'T9jS8wx',
    'container.build_id' => '5d379886',
    'container.build_time' => 1641296180,
], __DIR__.\DIRECTORY_SEPARATOR.'ContainerT9jS8wx');
