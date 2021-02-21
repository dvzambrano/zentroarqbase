
<feed xmlns="http://www.w3.org/2005/Atom">
    <title><?php echo $title ?></title>
    <subtitle>Eventos que comienzan en la última semana</subtitle>
    <link href="" rel="self"/>
    <link href=""/>
    <updated><?php echo $updated ?></updated>
    <author><name><?php echo $title ?></name></author>
    <id>Unique Id</id>
    <?php foreach ($events as $event): ?>
        <entry>
            <title><?php echo $event->getName() ?></title>
            <link href="<?php echo $host . $event->getId() ?>" />
            <id><?php echo $event->getId() ?></id>
            <updated></updated>
            <summary><?php echo $event->getComment() ?></summary>
            <author><name><?php echo $title ?></name></author>
        </entry>
    <?php endforeach ?>
</feed>