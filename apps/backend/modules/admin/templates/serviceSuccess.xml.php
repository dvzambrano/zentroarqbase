<?xml version="1.0" encoding="utf-8"?>
<events>
    <?php foreach ($events as $event): ?>
        <event url="<?php echo $host . $event->getId() ?>">
            <?php foreach ($event as $key => $value): ?>
                <<?php echo $key ?>><?php echo $event->getName() ?></<?php echo $key ?>>
            <?php endforeach ?>
        </event>
    <?php endforeach ?>
</events>