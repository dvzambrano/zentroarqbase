<?php use_stylesheet('../js/util/form/calendar/extensible-all.css') ?>

<div class="x-combo-list-item" style="vertical-align: middle; background-color: white;">
    <div class="x-cal-<?php echo $event->getCalendar()->getColor() ?>">
        <div class="mail-calendar-cat-color ext-cal-picker-icon">&nbsp;</div>
    </div>
    <div id="calendar-div-item-<?php echo $event->getCalendar()->getId() ?>">&nbsp;
        <b><?php echo $event->getName() ?></b>
        <?php if ($event->getLocation() && $event->getLocation() != ''): ?>
            <?php echo '&nbsp;&nbsp;(' . $event->getLocation() . ')&nbsp;&nbsp;' ?>
        <?php endif ?>
        <?php
        $date = date_create_from_format('Y-m-d H:i:s', $event->getStart());
        echo $date->format('d/m/Y h:i A')
        ?>
        <hr/>
        <?php echo $event->getComment() ?> 
        <?php if ($event->getLink() && $event->getLink() != ''): ?>
            <?php echo '<a href="' . $event->getLink() . '">' . $event->getLink() . '</a>' ?>
        <?php endif ?>
    </div>
</div>
<div class="x-clear"></div>