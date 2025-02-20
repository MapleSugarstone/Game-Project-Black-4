class Passive {
    constructor(trigger, whoTriggers, whoAffected, effect, deathTrigger, visualEffect, description) {
        this.triggerCondition = trigger;
        this.whoTriggers = whoTriggers;
        this.whoAffected = whoAffected;
        this.effect = effect;
        this.deathTrigger = deathTrigger;
        this.team = null;
        this.CID = null;
        this.visualEffect = visualEffect;
        this.description = description;
    }
}
