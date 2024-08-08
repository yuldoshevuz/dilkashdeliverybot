import { WizardScene } from "telegraf/scenes";
import i18n from "../config/i18n.config.js";
import { backInlineKeyboard, cancelKeyboard, confirmOrBackKeyboard, selectBookingDateKeyboard, selectBookingTimeKeyboard, selectPeopleCount } from "../utils/keyboards.js";
import { phoneValidation } from "../helpers/validations.js";
import { formatBookingDetails } from "../helpers/date.js";
import bookingRepo from "../reposotory/booking.repo.js";

const bookingScene = new WizardScene(
    "booking",
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery()
                const [ cursor, day, month ] = ctx.callbackQuery.data.split(":");
    
                if (cursor === "selectBookTableDate") {
                    const newDate = new Date()
                    newDate.setDate(day);
                    newDate.setMonth(month);
    
                    ctx.session.bookingDetails = {
                        bookingDate: newDate.getTime()
                    };

                    const { bookingDate } = ctx.session.bookingDetails;
    
                    await ctx.editMessageText(i18n.t("selectBookTableTime"), {
                        ...selectBookingTimeKeyboard(ctx.session.lang, bookingDate)
                    });
                    
                    return ctx.wizard.next();
                }
            }
    
            if (ctx.message) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, startTime, endTime ] = ctx.callbackQuery.data.split("-");
                const [ , data ] = ctx.callbackQuery.data.split("-")
    
                if (cursor === "selectBookTableTime") {
                    if (data === "back") {
                        await ctx.editMessageText(i18n.t("selectBookTableDate"), {
                            ...selectBookingDateKeyboard(ctx.session.lang)
                        });
                        return ctx.wizard.back();
                    }
    
                    const { bookingDate } = ctx.session.bookingDetails;
    
                    const startTimeDate = new Date(bookingDate);
                    const endtTimeDate = new Date(bookingDate);
    
                    startTimeDate.setHours(...startTime.split(":"));
                    endtTimeDate.setHours(...endTime.split(":"));;
    
                    ctx.session.bookingDetails.startTime = startTimeDate;
                    ctx.session.bookingDetails.endTime = endtTimeDate;
    
                    await ctx.editMessageText(i18n.t("howManyPeopleDoYouBook"), {
                        ...selectPeopleCount(ctx.session.lang, ctx.wizard.cursor + 1)
                    })
    
                    return ctx.wizard.next();
                }
            }
    
            if (ctx.message) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");
    
                if (cursor === "numberOfPeople") {
                    if (data === "back") {
                        const { bookingDate } = ctx.session.bookingDetails;

                        await ctx.editMessageText(i18n.t("selectBookTableTime"), {
                            ...selectBookingTimeKeyboard(ctx.session.lang, bookingDate)
                        });
                        return ctx.wizard.back();
                    }
    
                    ctx.session.bookingDetails.numberOfPeople = +data;
        
                    await ctx.editMessageText(i18n.t("whoIsBookingEnterName"), {
                        ...backInlineKeyboard(ctx.session.lang, "whoIsBookingEnterName")
                    });
                    return ctx.wizard.next();
                }
            }
    
            if (ctx.message) {
                await ctx.deleteMessage();
            } 
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":")
    
                if (cursor === "whoIsBookingEnterName" && data === "back") {
                    await ctx.editMessageText(i18n.t("howManyPeopleDoYouBook"), {
                        ...selectPeopleCount(ctx.session.lang)
                    });
                    return ctx.wizard.back();
                }
            }
    
            if (ctx.message?.text) {
                ctx.session.bookingDetails.customerName = ctx.message.text
    
                await ctx.reply(i18n.t("sendYourPhone"),
                    backInlineKeyboard(ctx.session.lang, "sendYourPhone")
                )
                return ctx.wizard.next();
            }
    
            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery()
                const [ cursor, data ] = ctx.callbackQuery.data.split(":")
    
                if (cursor === "sendYourPhone" && data === "back") {
                    await ctx.editMessageText(i18n.t("whoIsBookingEnterName"), {
                        ...backInlineKeyboard(ctx.session.lang, "whoIsBookingEnterName")
                    });
                    return ctx.wizard.back();
                }
            }

            if (ctx.message?.text) {
                const phone = ctx.message.text;

                if (!phoneValidation(phone)) {
                    await ctx.reply(i18n.t("sendYourPhone"),
                        backInlineKeyboard(ctx.session.lang, "sendYourPhone")
                    );
                    return;
                }

                ctx.session.bookingDetails.contactNumber = phone

                const details = formatBookingDetails(ctx.session.bookingDetails);
                const bookingDetails = i18n.t("bookingDetails", { ...details });
                
                await ctx.replyWithHTML(bookingDetails,
                    confirmOrBackKeyboard(ctx.session.lang)
                )

                return ctx.wizard.next();
            }

            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");

                if (cursor === "confirmBooking") {
                    if (data === "back") {
                        await ctx.editMessageText(i18n.t("sendYourPhone"), {
                            ...backInlineKeyboard(ctx.session.lang, "sendYourPhone")
                        });
                        return ctx.wizard.back();
                    }
                    
                    if (data === "confirm") {
                        await bookingRepo.create({
                            customerId: ctx.session.user.id,
                            ...ctx.session.bookingDetails
                        });

                        delete ctx.session.bookingDetails;

                        await ctx.editMessageText(i18n.t("doneBooking"));
                        await ctx.scene.leave();
                        await ctx.scene.enter("start");
                    }
                }
            }

            if (ctx.message) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    }
);

bookingScene.enter(async (ctx) => {
    try {
        const { lang } = ctx.session

        await ctx.reply(i18n.t("workTime"),
            cancelKeyboard(lang)
        );
        await ctx.reply(i18n.t("selectBookTableDate"), 
            selectBookingDateKeyboard(lang)
        );
    } catch (error) {
        console.error(error);
    }
});

bookingScene.hears(/^\/start|🚫 (Bekor qilish|Cancel|Отменить)$/, async (ctx) => {
    delete ctx.session?.bookingDetails;
    ctx.scene.enter("start");
});

export default bookingScene;