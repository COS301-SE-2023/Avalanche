import { BeakerIcon, HomeIcon } from '@heroicons/react/24/solid';

interface IMenuItem {
    text: string,
    icon: any,
    page: string,
}

interface IMenu {
    items: IMenuItem[],
}

const MenuOptions: IMenu = {
    items: [
        {
            text: "Home",
            icon: HomeIcon,
            page: "dashboard"
        }
    ]
}