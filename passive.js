class Passive {
    constructor(trigger, whoTriggers, whoAffected, effect, deathTrigger) {
        this.triggerCondition = trigger;
        this.whoTriggers = whoTriggers;
        this.whoAffected = whoAffected;
        this.effect = effect;
        this.deathTrigger = deathTrigger;
        this.team = null;
        this.CID = null;
    }
}
